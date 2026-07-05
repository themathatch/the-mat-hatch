import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, // এই আইকনটি এখন যুক্ত করা হয়েছে
   
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  X,
  MapPin,
  
  ArrowUpDown,
  Loader2,
  Package,
  User,
  Trash2,
  Maximize2,
  FileText,
  Download
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc, 
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
  const [viewCustomImage, setViewCustomImage] = useState<string | null>(null);

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

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('⚠️ WARNING: Terminate this order deployment permanently?')) {
      const toastId = toast.loading('Terminating order asset...');
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        toast.success('Order removed from logs', { id: toastId });
        fetchOrders();
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
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Deployment Logs</h1>
        <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Order Intelligence Center</p>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 border-white/5">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search ID, Name or Phone..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-all" />
        </div>
        <div className="flex gap-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white outline-none cursor-pointer">
            <option value="all">All Logs</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button onClick={fetchOrders} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-neon-cyan hover:bg-neon-cyan/10 transition-all">
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Operative</th>
                <th className="px-6 py-5">Units</th>
                <th className="px-6 py-5">Credits</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center italic text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" /> Syncing Logs...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center italic text-gray-500">No matching deployments detected.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-400 font-heading tracking-widest">#{order.id.slice(-8).toUpperCase()}</span>
                      {order.items?.some((i: any) => i.id?.includes('custom')) && (
                          <span className="ml-2 px-2 py-0.5 bg-neon-purple/20 text-neon-purple text-[8px] font-black rounded uppercase tracking-widest">Custom</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white uppercase">{order.customerName}</p>
                      <p className="text-[10px] text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{order.items?.length} Assets</td>
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
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"><Eye size={18} /></button>
                        <button onClick={() => handleDeleteOrder(order.id)} className="p-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-[#E74C3C] transition-all"><Trash2 size={18} /></button>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-panel border-white/10 bg-[#090514] p-8 md:p-10 custom-scrollbar">
              
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                    DEPLOYMENT DETAILS
                    {selectedOrder.items?.some((i: any) => i.id?.includes('custom')) && (
                        <span className="px-3 py-1 bg-neon-purple text-white text-[10px] rounded-full shadow-neon-purple/20 animate-pulse">CUSTOM DESIGN ORDER</span>
                    )}
                  </h2>
                  <p className="text-neon-cyan text-xs font-bold tracking-[0.3em] uppercase mt-1">LOG_ID: #{selectedOrder.id.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:text-white"><X size={28} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Info Columns */}
                <div className="lg:col-span-2 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><User size={14} className="text-neon-cyan" /> Operative Info</h3>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <p className="text-white font-bold uppercase">{selectedOrder.customerName}</p>
                        <p className="text-xs text-gray-400">{selectedOrder.email}</p>
                        <p className="text-xs text-neon-cyan font-bold">{selectedOrder.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><MapPin size={14} className="text-neon-pink" /> Coordinates</h3>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-300 leading-relaxed">{selectedOrder.shippingAddress?.address}, <br/>{selectedOrder.shippingAddress?.city} ({selectedOrder.shippingAddress?.area})</p>
                      </div>
                    </div>
                  </div>

                  {/* Loadout Section */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Package size={14} className="text-neon-purple" /> Equipment Loadout</h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item: any, idx: number) => {
                        const isCustom = item.id?.includes('custom');
                        return (
                          <div key={idx} className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-16 h-16 rounded-xl overflow-hidden border p-0.5",
                                    isCustom ? "border-neon-purple shadow-neon-purple/20" : "border-white/5"
                                )}>
                                  <img src={item.images?.[0]?.url} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                  <h4 className="font-black text-white uppercase tracking-tighter">{item.name}</h4>
                                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Unit Price: ৳{item.price.toLocaleString()} | Qty: {item.quantity}</p>
                                  {isCustom && (
                                      <button 
                                        onClick={() => setViewCustomImage(item.images?.[0]?.url)}
                                        className="mt-3 flex items-center gap-2 text-[10px] font-black text-neon-cyan uppercase tracking-widest hover:underline"
                                      >
                                          <Maximize2 size={12} /> View Design File
                                      </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xl font-black text-white font-heading">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>

                            {isCustom && item.description && (
                                <div className="mt-6 p-4 rounded-xl bg-[#130C25] border border-neon-purple/20 flex gap-4">
                                    <FileText size={18} className="text-neon-purple flex-shrink-0" />
                                    <div>
                                        <p className="text-[9px] font-black text-neon-purple uppercase tracking-widest mb-1">Customization Protocol</p>
                                        <p className="text-xs text-gray-400 italic">"{item.description}"</p>
                                    </div>
                                </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status Column */}
                <div className="space-y-6">
                  <div className="glass-panel p-6 border-white/5 bg-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Financial Summary</h3>
                    <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                      <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="text-white">৳{selectedOrder.summary?.subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-500"><span>Transport</span><span className="text-neon-cyan">৳{selectedOrder.summary?.shipping}</span></div>
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-white">Final Credits</span>
                        <span className="text-2xl font-black text-neon-cyan font-heading">৳{selectedOrder.summary?.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Update Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)} className={cn("py-3 rounded-xl text-[10px] font-black uppercase border transition-all", selectedOrder.status === status ? "bg-neon-cyan text-dark border-neon-cyan shadow-neon-cyan/20" : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>
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

      {/* Custom Image Lightbox */}
      <AnimatePresence>
          {viewCustomImage && (
              <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-10">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewCustomImage(null)} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" />
                  <div className="relative z-10 w-full max-w-6xl text-center">
                      <button onClick={() => setViewCustomImage(null)} className="absolute -top-16 right-0 p-4 text-white hover:text-neon-pink transition-all"><X size={40} /></button>
                      <h3 className="text-white font-black uppercase tracking-[0.5em] mb-6 text-xl">CUSTOM_BATTLE_ARTWORK_PREVIEW</h3>
                      <div className="glass-panel border-neon-cyan/30 p-2 overflow-hidden rounded-3xl">
                        <img src={viewCustomImage} className="w-full h-auto max-h-[75vh] object-contain rounded-2xl" alt="" />
                      </div>
                      <div className="mt-8">
                          <a href={viewCustomImage} download="custom-design.png" target="_blank" rel="noreferrer" className="btn-solid !px-12 flex items-center gap-3">
                              <Download size={20} /> DOWNLOAD HIGH-RES ASSET
                          </a>
                      </div>
                  </div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default OrderLogs;