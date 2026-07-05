import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
   
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  Mail,
  ArrowLeft,
  ChevronRight,
  PackageCheck,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/services/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendOrderConfirmationEmail } from '@/services/emailService';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartSubtotal, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [shippingArea, setShippingArea] = useState<'inside' | 'outside'>('inside');
  const [formData, setFormData] = useState({
    fullName: profile?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  const shippingCost = shippingArea === 'inside' ? 80 : 130;
  const subtotal = getCartSubtotal();
  const finalTotal = subtotal + shippingCost;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Updated Validation: City is auto-assigned based on sector
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
      toast.error('Tactical Error: Fill in Name, Email, Phone and Address!');
      return;
    }

    setIsLoading(true);
    try {
      const detectedCity = shippingArea === 'inside' ? 'Dhaka' : 'Outside Dhaka';

      // 1. Prepare Order Data
      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          area: shippingArea === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
          city: detectedCity,
          address: formData.address,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          images: item.images,
          description: item.description || ''
        })),
        summary: {
          subtotal: subtotal,
          shipping: shippingCost,
          total: finalTotal
        },
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // 2. Save Order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // 3. META PIXEL PURCHASE TRACKING
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Purchase', {
          content_ids: items.map(item => item.id),
          content_type: 'product',
          value: finalTotal,
          currency: 'BDT',
          num_items: items.length,
          content_name: items.map(item => item.name).join(', ')
        });
      }

      // 4. Send Confirmation Email via EmailJS
      const itemsString = items.map(item => 
        `${item.name} (x${item.quantity}) - ৳${((item.discountPrice || item.price) * item.quantity).toLocaleString()}`
      ).join('\n');

      await sendOrderConfirmationEmail({
        orderId: docRef.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        totalAmount: finalTotal.toLocaleString(),
        shippingAddress: `${formData.address} (${orderData.shippingAddress.area})`,
        items: itemsString
      });

      toast.success('Deployment Success! Invoice Dispatched.', { duration: 5000 });
      clearCart();
      navigate(`/order-success/${docRef.id}`);

    } catch (error: any) {
      console.error("Order Critical Error:", error);
      toast.error('System Overload. Order failed to deploy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-7xl"
        >
          
          <div className="mb-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-all text-xs font-black uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Return to Armory
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              ORDER <span className="text-transparent bg-clip-text bg-purple-gradient animate-pulse">DEPLOYMENT</span>
            </h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              
              {/* Delivery Zone */}
              <div className="glass-panel p-8 border-white/5">
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                  <MapPin size={24} className="text-neon-cyan" />
                  Select Delivery Sector
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShippingArea('inside')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all text-left relative",
                      shippingArea === 'inside' ? "bg-neon-cyan/10 border-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]" : "bg-white/5 border-white/10"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black tracking-widest uppercase text-[10px]">Dhaka City</span>
                      {shippingArea === 'inside' && <CheckCircle2 size={16} className="text-neon-cyan" />}
                    </div>
                    <span className="text-2xl font-black text-white">৳80</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingArea('outside')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all text-left relative",
                      shippingArea === 'outside' ? "bg-neon-purple/10 border-neon-purple shadow-[0_0_20px_rgba(157,0,255,0.1)]" : "bg-white/5 border-white/10"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black tracking-widest uppercase text-[10px]">Outside Dhaka</span>
                      {shippingArea === 'outside' && <CheckCircle2 size={16} className="text-neon-purple" />}
                    </div>
                    <span className="text-2xl font-black text-white">৳130</span>
                  </button>
                </div>
              </div>

              {/* Gamer Credentials */}
              <div className="glass-panel p-8 border-white/5 relative overflow-hidden">
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                  <User size={24} className="text-neon-cyan" />
                  Gamer Credentials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Combat Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-neon-cyan outline-none transition-all" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Base (For Invoice)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-neon-cyan outline-none transition-all" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Signal Line (Phone)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01XXXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-neon-cyan outline-none transition-all" required />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Coordinates (Full Address)</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="House, Street, Sector, Area details..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-neon-cyan outline-none transition-all resize-none" required />
                  </div>
                </div>
              </div>

              {/* Payment Protocol */}
              <div className="glass-panel p-8 border-white/5">
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                  <CreditCard size={24} className="text-neon-purple" />
                  Payment Protocol
                </h3>
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                    <PackageCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500 tracking-tight">Deployment active. Pay upon equipment receipt.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 border-white/5 sticky top-32">
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4">Tactical Summary</h3>

                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedVariantId}`} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/5 bg-white/5">
                          <img src={item.images[0]?.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Base Credits</span>
                    <span className="text-white">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Transport Fee</span>
                    <span className="text-neon-cyan">৳{shippingCost}</span>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter text-white">Final Credits</span>
                    <span className="text-3xl font-black text-neon-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] font-heading">
                      ৳{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full btn-solid !py-5 mt-10 flex items-center justify-center gap-3 group shadow-neon-cyan/20 uppercase font-black"
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin text-dark" /> : (
                    <>CONFIRM DEPLOYMENT <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <ShieldCheck size={14} className="text-neon-cyan" />
                  System Secure & Verified
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Checkout;