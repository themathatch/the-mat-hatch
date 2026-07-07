import React, { useEffect, useState, useMemo } from 'react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, DollarSign, ShoppingBag, Target, Layers, 
   Loader2,  Filter, 
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { 
  format,  getYear, 
  eachDayOfInterval, startOfMonth, endOfMonth,
  eachMonthOfInterval, startOfYear, endOfYear,
  isSameDay, isSameMonth
} from 'date-fns';

const COLORS = ['#00F0FF', '#9D00FF', '#FF0055', '#F59E0B', '#10B981'];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  // Tactical Filters
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>("Full Year");

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = 2025; y <= new Date().getFullYear(); y++) years.push(y);
    return years;
  }, []);

  const monthOptions = [
    "Full Year", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          jsDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
        }));
        setAllOrders(data);
      } catch (error) {
        console.error("Analytics Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Filtered Logic & Chart Data Processing
  const processedData = useMemo(() => {
    // ১. ফিল্টার করা অর্ডারগুলো আলাদা করা
    const filteredOrders = allOrders.filter(order => {
      const oYear = getYear(order.jsDate);
      const oMonth = format(order.jsDate, 'MMMM');
      return oYear === selectedYear && (selectedMonth === "Full Year" || oMonth === selectedMonth);
    });

    // ২. রাজস্ব গ্রাফের জন্য ডাটা তৈরি (Trajectory)
    let trajectory: any[] = [];
    if (selectedMonth === "Full Year") {
      // যদি পুরো বছর হয়, তবে প্রতি মাসের ডাটা দেখাবে
      const months = eachMonthOfInterval({
        start: startOfYear(new Date(selectedYear, 0, 1)),
        end: endOfYear(new Date(selectedYear, 0, 1))
      });
      trajectory = months.map(m => ({
        label: format(m, 'MMM'),
        revenue: filteredOrders
          .filter(o => isSameMonth(o.jsDate, m))
          .reduce((sum, o) => sum + (o.summary?.total || 0), 0)
      }));
    } else {
      // যদি নির্দিষ্ট মাস হয়, তবে প্রতিদিনের ডাটা দেখাবে
      const monthIdx = monthOptions.indexOf(selectedMonth) - 1;
      const days = eachDayOfInterval({
        start: startOfMonth(new Date(selectedYear, monthIdx, 1)),
        end: endOfMonth(new Date(selectedYear, monthIdx, 1))
      });
      trajectory = days.map(d => ({
        label: format(d, 'dd'),
        revenue: filteredOrders
          .filter(o => isSameDay(o.jsDate, d))
          .reduce((sum, o) => sum + (o.summary?.total || 0), 0)
      }));
    }

    // ৩. ক্যাটাগরি এবং স্ট্যাটাস ডাটা
    const categoryMap: any = {};
    const statusMap: any = {};
    let revenue = 0;

    filteredOrders.forEach(order => {
      revenue += (order.summary?.total || 0);
      statusMap[order.status] = (statusMap[order.status] || 0) + 1;
      order.items?.forEach((item: any) => {
        categoryMap[item.category || 'Other'] = (categoryMap[item.category || 'Other'] || 0) + 1;
      });
    });

    return {
      revenue,
      orderCount: filteredOrders.length,
      trajectory,
      categories: Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] })),
      statuses: Object.keys(statusMap).map(name => ({ name, value: statusMap[name] }))
    };
  }, [allOrders, selectedYear, selectedMonth]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-[0.4em] font-black text-xs">Syncing Satellite Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Visual Intelligence</h1>
          <p className="text-gray-500 text-sm font-heading tracking-widest uppercase mt-1">Tactical Market Performance Overview</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 px-3 text-neon-cyan">
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Filter Logs:</span>
          </div>
          <select 
            value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-dark/80 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold uppercase text-white outline-none focus:border-neon-cyan cursor-pointer"
          >
            {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-dark/80 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold uppercase text-white outline-none focus:border-neon-purple cursor-pointer"
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* 2. Top Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
          <DollarSign className="absolute -right-4 -top-4 opacity-5 text-neon-cyan group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Net Credits (Revenue)</p>
          <h3 className="text-4xl font-black text-white font-heading">৳{processedData.revenue.toLocaleString()}</h3>
        </div>
        <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
          <ShoppingBag className="absolute -right-4 -top-4 opacity-5 text-neon-purple group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Tactical Deployments</p>
          <h3 className="text-4xl font-black text-white font-heading">{processedData.orderCount}</h3>
        </div>
        <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
          <Target className="absolute -right-4 -top-4 opacity-5 text-neon-pink group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Avg. Value Per Unit</p>
          <h3 className="text-4xl font-black text-white font-heading">
            ৳{processedData.orderCount > 0 ? Math.round(processedData.revenue / processedData.orderCount).toLocaleString() : 0}
          </h3>
        </div>
      </div>

      {/* 3. Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trajectory Graph */}
        <div className="glass-panel p-8 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-neon-cyan" size={20} />
            <h3 className="font-black uppercase tracking-widest text-sm text-white">Revenue Trajectory</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData.trajectory}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="label" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#00F0FF" strokeWidth={3} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Popularity */}
        <div className="glass-panel p-8 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="text-neon-purple" size={20} />
            <h3 className="font-black uppercase tracking-widest text-sm text-white">Sector Popularity</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {processedData.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-panel p-8 border-white/5">
          <h3 className="font-black uppercase tracking-widest text-sm text-white mb-8">System Distribution (Orders)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={processedData.statuses} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {processedData.statuses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advice Panel */}
        <div className="glass-panel p-8 border-white/5 bg-gradient-to-br from-neon-cyan/5 to-transparent flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan animate-pulse"><TrendingUp size={24} /></div>
                <h3 className="text-xl font-black uppercase text-white">Neural Logic Report</h3>
            </div>
            <p className="text-gray-400 text-sm italic leading-relaxed">
              "Analyzing sector {selectedMonth} of {selectedYear}. Current trajectory shows optimal performance. Recommend maintaining inventory for top-selling sectors and deploying more featured drops during high-revenue cycles."
            </p>
        </div>

      </div>
    </div>
  );
};

export default Analytics;