import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
   
  Search, 
   
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  X,
  
  ArrowUpDown,
  Loader2,
  
  Trash2 // ডিলিট আইকন যুক্ত করা হয়েছে
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc, // ডিলিট ফাংশন যুক্ত করা হয়েছে
  doc,
  Timestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';


const OrderLogs: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Order Fetch Error:", error);
      toast.error("Failed to sync logs");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const toastId = toast.loading('Updating status...');
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      toast.success(`Order: ${newStatus}`, { id: toastId });
      fetchOrders();
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error) {
      toast.error("Update failed", { id: toastId });
    }
  };

  // ORDER DELETION SYSTEM
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('⚠️ WARNING: Terminate this order deployment permanently? This cannot be undone.')) {
      const toastId = toast.loading('Terminating order asset...');
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        toast.success('Order removed from logs', { id: toastId });
        fetchOrders(); // লিস্ট রিফ্রেশ করা
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      } catch (error) {
        toast.error("Termination failed", { id: toastId });
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-yellow-500" />;
      case 'shipped': return <Truck size={14} className="text-neon-purple" />;
      case 'delivered': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'cancelled': return <XCircle size={14} className="text-neon-pink" />;
      default: return <Clock size={14} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.customerName || '';
    const orderId = order.id || '';
    const phone = order.phone || '';
    const matchesSearch = orderId.toLowerCase().includes(searchQuery.toLowerCase()) || customerName.toLowerCase().includes(searchQuery.toLowerCase()) || phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Deployment Logs</h1>
        <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Manage Tactical Deployments</p>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 border-white/5">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID, Name or Phone..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-all" />
        </div>
        <div className="flex gap-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white outline-none cursor-pointer">
            <option value="all">All Logs</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={fetchOrders} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-neon-cyan hover:bg-neon-cyan/10 transition-all">
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Gamer Profile</th>
                <th className="px-6 py-5">Credits</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center italic text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" /> Loading Logs...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center italic text-gray-500">No matching deployments detected.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-400 font-heading tracking-widest">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white uppercase">{order.customerName}</p>
                      <p className="text-[10px] text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-neon-cyan">৳{order.summary?.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border",
                        order.status === 'pending' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : 
                        order.status === 'delivered' ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-neon-pink border-neon-pink/20 bg-neon-pink/5"
                      )}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-neon-cyan transition-all"><Eye size={18} /></button>
                        {/* DELETE BUTTON ADDED HERE */}
                        <button onClick={() => handleDeleteOrder(order.id)} className="p-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-[#E74C3C] transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel border-white/10 bg-[#090514] p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Deployment Details</h2>
                <div className="flex gap-4">
                    {/* Delete button also in Modal for convenience */}
                    <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="p-2 rounded-lg bg-[#E74C3C]/10 text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white transition-all"><Trash2 size={20} /></button>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:text-white"><X size={28} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Customer Info</h3>
                            <p className="text-sm text-white font-bold">{selectedOrder.customerName}</p>
                            <p className="text-xs text-gray-400">{selectedOrder.email}</p>
                            <p className="text-xs text-gray-400">{selectedOrder.phone}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Coordinates</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{selectedOrder.shippingAddress?.address}, <br/>{selectedOrder.shippingAddress?.city}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Equipment Loadout</h3>
                        {selectedOrder.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                                <span className="font-bold text-white uppercase">{item.name} (x{item.quantity})</span>
                                <span className="text-neon-cyan">৳{item.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-panel p-6 border-white/5 bg-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Financial Summary</h3>
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between"><span>Subtotal</span><span className="text-white">৳{selectedOrder.summary?.subtotal}</span></div>
                      <div className="flex justify-between"><span>Transport</span><span className="text-neon-cyan">৳{selectedOrder.summary?.shipping}</span></div>
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="font-black uppercase">Final</span>
                        <span className="text-xl font-black text-neon-cyan">৳{selectedOrder.summary?.total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Set Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)} className={cn("py-2.5 rounded-lg text-[9px] font-black uppercase border transition-all", selectedOrder.status === status ? "bg-neon-cyan text-dark border-neon-cyan" : "bg-white/5 border-white/10 text-gray-500")}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderLogs;