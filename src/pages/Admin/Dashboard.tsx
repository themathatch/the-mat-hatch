import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  
  Filter
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

import { format, getYear } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Tactical Filter States
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'MMMM'));

  // বছর তালিকা (২০২৫ থেকে বর্তমান বছর পর্যন্ত)
  const years = useMemo(() => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = startYear; i <= currentYear; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, []);

  const months = [
    "Full Year", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ১. সব অর্ডার নিয়ে আসা
        const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const ordersData = oSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          jsDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
        }));
        setAllOrders(ordersData);

        // ২. ইউজার এবং প্রোডাক্ট সংখ্যা নিয়ে আসা
        const uSnap = await getDocs(collection(db, 'users'));
        const pSnap = await getDocs(collection(db, 'products'));
        setTotalUsers(uSnap.size);
        setTotalProducts(pSnap.size);

      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ক্যালকুলেশন লজিক (সিলেক্ট করা মাস ও বছর অনুযায়ী)
  const stats = useMemo(() => {
    const filtered = allOrders.filter(order => {
      const oYear = getYear(order.jsDate);
      const oMonth = format(order.jsDate, 'MMMM');

      const isYearMatch = oYear === selectedYear;
      const isMonthMatch = selectedMonth === "Full Year" || oMonth === selectedMonth;

      return isYearMatch && isMonthMatch;
    });

    const revenue = filtered.reduce((sum, order) => sum + (order.summary?.total || 0), 0);
    return {
      revenue,
      orders: filtered.length
    };
  }, [allOrders, selectedYear, selectedMonth]);

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Dashboard Header & Tactical Global Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Operational Intel</h1>
          <p className="text-gray-500 text-sm font-heading tracking-widest uppercase mt-1">Satellite View of Market Performance</p>
        </div>

        {/* YEAR & MONTH SELECTOR - FIXED AT TOP */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-neon-cyan/5">
          <div className="flex items-center gap-2 px-3 text-neon-cyan border-r border-white/10 mr-1">
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Sector Filter</span>
          </div>
          
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-dark/80 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-neon-cyan cursor-pointer transition-all"
          >
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-dark/80 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-neon-purple cursor-pointer transition-all"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* REVENUE CARD (Dynamic) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 border-white/5 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 text-neon-cyan group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-6 text-neon-cyan">
            <DollarSign size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Total Revenue</p>
          <h3 className="text-3xl font-black text-white font-heading tracking-wider">৳{stats.revenue.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
            <TrendingUp size={12} />
            <span>Target: {selectedMonth} {selectedYear}</span>
          </div>
        </motion.div>

        {/* ORDERS CARD (Dynamic) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-8 border-white/5 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 text-neon-purple group-hover:scale-110 transition-transform"><ShoppingBag size={80} /></div>
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-6 text-neon-purple">
            <ShoppingBag size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Orders Deployed</p>
          <h3 className="text-3xl font-black text-white font-heading tracking-wider">{stats.orders}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-neon-purple">
            <TrendingUp size={12} />
            <span>Success verified</span>
          </div>
        </motion.div>

        {/* TOTAL USERS (Lifetime) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 border-white/5">
          <div className="w-12 h-12 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-6 text-neon-pink"><Users size={24} /></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Total Gamers</p>
          <h3 className="text-3xl font-black text-white font-heading tracking-wider">{totalUsers}</h3>
          <p className="text-[9px] text-gray-600 uppercase mt-4 tracking-widest">Global Community Base</p>
        </motion.div>

        {/* TOTAL PRODUCTS (Lifetime) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 border-white/5">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-500"><Package size={24} /></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Tactical Assets</p>
          <h3 className="text-3xl font-black text-white font-heading tracking-wider">{totalProducts}</h3>
          <p className="text-[9px] text-gray-600 uppercase mt-4 tracking-widest">Active Inventory Online</p>
        </motion.div>
      </div>

      {/* 3. Recent Logs Table */}
      <div className="glass-panel border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-white">
            <Clock className="text-neon-cyan" size={18} />
            Latest Signals (Recent Activity)
          </h3>
          <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-black text-neon-cyan hover:underline uppercase tracking-widest">Access Order Logs</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0D0B14] text-[10px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Gamer</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-600 italic">Syncing satellite feed...</td></tr>
              ) : allOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-400">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 uppercase font-bold text-white">{order.customerName}</td>
                  <td className="px-6 py-4 font-black text-neon-cyan">৳{order.summary?.total?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => navigate('/admin/orders')} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><ArrowUpRight size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;