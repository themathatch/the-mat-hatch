import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Navigation যুক্ত করা হয়েছে
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  MousePointer2
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Initialize Navigation
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));
        const productsSnap = await getDocs(collection(db, 'products'));

        let revenue = 0;
        ordersSnap.forEach(doc => {
          revenue += doc.data().summary?.total || 0;
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: ordersSnap.size,
          totalCustomers: usersSnap.size,
          totalProducts: productsSnap.size
        });

        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        const recentData = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentOrders(recentData);

      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
    { label: 'Orders Deployed', value: stats.totalOrders, icon: <ShoppingBag />, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
    { label: 'Gamer Base', value: stats.totalCustomers, icon: <Users />, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
    { label: 'Tactical Gear', value: stats.totalProducts, icon: <Package />, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Operational Intelligence</h1>
        <p className="text-gray-500 text-sm font-heading tracking-widest uppercase mt-1">Real-time battlefield data overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 border-white/5 relative group overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", stat.color)}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 80 })}
            </div>
            
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/10", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white font-heading">{stat.value}</h3>
            
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
              <TrendingUp size={12} />
              <span>+12.5% vs last session</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 glass-panel border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-white">
              <Clock className="text-neon-cyan" size={18} />
              Latest Deployments
            </h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-[10px] font-black text-neon-cyan hover:underline uppercase tracking-widest"
            >
              View All Logs
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0D0B14] text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Gamer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-600 italic">Syncing with armory...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-600 italic">No deployments detected.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-400 font-heading tracking-widest">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white uppercase">{order.customerName}</span>
                          <span className="text-[10px] text-gray-500">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border",
                          order.status === 'pending' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : "text-green-500 border-green-500/20 bg-green-500/5"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-neon-cyan">৳{order.summary?.total?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Deployment Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-white/5 bg-gradient-to-br from-neon-purple/10 to-transparent">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">System Message</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-neon-purple" size={20} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Base security is nominal. All tactical gear shipments are tracking according to schedule.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 blur-3xl transition-all"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Quick Action</h3>
            <div className="space-y-3">
              {/* This button is now functional */}
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full btn-solid !py-3 !text-[10px] flex items-center justify-center gap-2 shadow-neon-cyan/20"
              >
                <Package size={16} />
                ADD NEW PRODUCT
              </button>
              
              <button className="w-full border border-white/10 hover:border-neon-purple rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2">
                <MousePointer2 size={16} className="text-neon-purple" />
                EDIT SITE DESIGN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;