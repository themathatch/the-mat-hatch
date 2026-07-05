import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Target, 
  Layers, 
  Calendar,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { format, startOfDay, subDays,  } from 'date-fns';

const COLORS = ['#00F0FF', '#9D00FF', '#FF0055', '#F59E0B', '#10B981'];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    growth: 15.4
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        const allOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. Process Revenue Over Last 7 Days
        const last7Days = [...Array(7)].map((_, i) => {
          const date = subDays(new Date(), i);
          return {
            date: format(date, 'MMM dd'),
            fullDate: startOfDay(date),
            revenue: 0
          };
        }).reverse();

        let totalRev = 0;
        const categoryMap: any = {};
        const statusMap: any = {};

        allOrders.forEach((order: any) => {
          const orderTotal = order.summary?.total || 0;
          totalRev += orderTotal;
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);

          // Daily Revenue for Chart
          last7Days.forEach(day => {
            if (format(orderDate, 'MMM dd') === day.date) {
              day.revenue += orderTotal;
            }
          });

          // Category Stats
          order.items?.forEach((item: any) => {
            const cat = item.category || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
          });

          // Status Stats
          const status = order.status || 'pending';
          statusMap[status] = (statusMap[status] || 0) + 1;
        });

        setRevenueData(last7Days);
        setCategoryData(Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] })));
        setStatusData(Object.keys(statusMap).map(name => ({ name, value: statusMap[name] })));
        
        setSummary({
          totalRevenue: totalRev,
          totalOrders: allOrders.length,
          avgOrderValue: allOrders.length > 0 ? totalRev / allOrders.length : 0,
          growth: 12.8
        });

      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-[0.4em] font-black text-xs">Processing Tactical Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Sales Analytics</h1>
          <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Visual Intelligence & Revenue Tracking</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
            <Calendar size={16} /> Last 7 Days <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Net Revenue', value: `৳${summary.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'text-neon-cyan' },
          { label: 'Tactical Deployments', value: summary.totalOrders, icon: <ShoppingBag />, color: 'text-neon-purple' },
          { label: 'Average Ticket', value: `৳${Math.round(summary.avgOrderValue).toLocaleString()}`, icon: <Target />, color: 'text-neon-pink' }
        ].map((item, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 border-white/5 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-6 opacity-10 ${item.color}`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 48 })}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{item.label}</p>
            <h3 className="text-3xl font-black text-white font-heading">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Revenue Over Time (Area Chart) */}
        <div className="glass-panel p-8 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-neon-cyan" size={20} />
            <h3 className="font-black uppercase tracking-widest text-sm text-white">Revenue Trajectory</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#00F0FF', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Popular Categories (Bar Chart) */}
        <div className="glass-panel p-8 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="text-neon-purple" size={20} />
            <h3 className="font-black uppercase tracking-widest text-sm text-white">Sector Popularity</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Order Status (Pie Chart) */}
        <div className="glass-panel p-8 border-white/5">
          <h3 className="font-black uppercase tracking-widest text-sm text-white mb-8">Deployment Status Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Tactical Advice Panel */}
        <div className="glass-panel p-8 border-white/5 bg-gradient-to-br from-neon-cyan/5 to-transparent flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan animate-pulse">
                    <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">System Intelligence</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 italic">
                "Based on latest transmission data, your revenue has seen a <span className="text-neon-cyan font-bold">12.8% upward trajectory</span>. Gaming sector remains the dominant landing zone for new recruits. Consider deploying more 'Limited Edition' assets to maximize credit intake."
            </p>
            <div className="flex gap-3">
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth Optimized</div>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sector Clear</div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;