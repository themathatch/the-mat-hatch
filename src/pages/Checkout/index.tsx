import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  
  User, 
 
  ArrowLeft,
  ChevronRight,
  PackageCheck,
  Loader2,
 
  ShoppingCart,
 
  FileText
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Information, 2: Review
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
    if (items.length === 0) navigate('/products');
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Synchronizing deployment data...');
    try {
      const detectedCity = shippingArea === 'inside' ? 'Dhaka' : 'Outside Dhaka';
      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          area: detectedCity,
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
        summary: { subtotal, shipping: shippingCost, total: finalTotal },
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Meta Pixel Tracking
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Purchase', {
          content_ids: items.map(item => item.id),
          content_type: 'product',
          value: finalTotal,
          currency: 'BDT'
        });
      }

      // Email Logic
      const itemsString = items.map(item => `${item.name} (x${item.quantity})`).join('\n');
      await sendOrderConfirmationEmail({
        orderId: docRef.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        totalAmount: finalTotal.toLocaleString(),
        shippingAddress: `${formData.address} (${detectedCity})`,
        items: itemsString
      });

      toast.success('Mission Accomplished!', { id: toastId });
      clearCart();
      navigate(`/order-success/${docRef.id}`);
    } catch (error) {
      toast.error('Tactical Error: Link Lost', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout Process | THE MAT HATCH</title></Helmet>

      <div className="min-h-screen bg-[#06040C] pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          
          {/* STEP HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
                STEP {currentStep} <span className="text-neon-cyan">/ 02</span>
            </h1>
            <div className="flex gap-2">
                <div className={cn("w-10 h-1.5 rounded-full transition-all duration-500", currentStep === 1 ? "bg-neon-cyan shadow-neon-cyan" : "bg-white/10")} />
                <div className={cn("w-10 h-1.5 rounded-full transition-all duration-500", currentStep === 2 ? "bg-neon-purple shadow-neon-purple" : "bg-white/10")} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: CUSTOMER INFORMATION */}
            {currentStep === 1 && (
              <motion.div 
                key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6 md:p-8 border-white/10">
                  <h2 className="text-lg font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                    <User size={20} className="text-neon-cyan" /> Gamer Identification
                  </h2>

                  <div className="space-y-5">
                    <div className="relative">
                      <label className="text-[9px] font-black uppercase text-gray-500 ml-1 mb-1 block">Full Tactical Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Combat Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-neon-cyan outline-none transition-all" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1 mb-1 block">Secure Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-neon-cyan outline-none transition-all" required />
                        </div>
                        <div className="relative">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1 mb-1 block">Signal Line (Phone)</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01XXXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-neon-cyan outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="relative">
                      <label className="text-[9px] font-black uppercase text-gray-500 ml-1 mb-1 block">Deployment Coordinates (Address)</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="House, Street, Area details..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-neon-cyan outline-none transition-all resize-none" required />
                    </div>

                    {/* COMPACT SECTOR SELECTOR */}
                    <div className="pt-4 border-t border-white/5">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1 mb-3 block">Select Delivery Sector</label>
                        <div className="flex gap-3">
                            <button
                                type="button" onClick={() => setShippingArea('inside')}
                                className={cn("flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all", 
                                shippingArea === 'inside' ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan" : "bg-white/5 border-white/10 text-gray-500")}
                            >
                                Inside Dhaka (৳80)
                            </button>
                            <button
                                type="button" onClick={() => setShippingArea('outside')}
                                className={cn("flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all", 
                                shippingArea === 'outside' ? "bg-neon-purple/10 border-neon-purple text-neon-purple" : "bg-white/5 border-white/10 text-gray-500")}
                            >
                                Outside Dhaka (৳130)
                            </button>
                        </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if(formData.fullName && formData.phone && formData.email && formData.address) setCurrentStep(2);
                    else toast.error("Complete Gamer Identification!");
                  }}
                  className="w-full btn-solid !py-5 shadow-neon-cyan/20 flex items-center justify-center gap-3 font-black uppercase tracking-widest"
                >
                  NEXT: REVIEW DEPLOYMENT <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: ORDER REVIEW */}
            {currentStep === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Items Review */}
                <div className="glass-panel p-6 border-white/10">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                        <ShoppingCart size={14} /> Equipment Review
                    </h3>
                    <div className="space-y-4">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white uppercase">{item.name}</span>
                                    <span className="text-[10px] text-neon-cyan font-black uppercase">Quantity: {item.quantity}</span>
                                </div>
                                {/* TINY IMAGE ON RIGHT */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    <img src={item.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Review */}
                <div className="glass-panel p-6 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-neon-purple"><FileText size={60} /></div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Deployment Coordinates</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-white font-bold uppercase">{formData.fullName}</p>
                        <p className="text-xs text-gray-400">{formData.phone} | {formData.email}</p>
                        <p className="text-xs text-gray-300 leading-relaxed italic">"{formData.address}"</p>
                        <div className="inline-block mt-2 px-3 py-1 rounded bg-neon-purple/20 border border-neon-purple/30 text-[9px] font-black text-neon-purple uppercase tracking-widest">
                            Sector: {shippingArea === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                        </div>
                    </div>
                    <button onClick={() => setCurrentStep(1)} className="mt-6 text-[9px] font-black text-neon-cyan uppercase flex items-center gap-1 hover:underline">
                        <ArrowLeft size={12} /> Re-edit Information
                    </button>
                </div>

                {/* Price Finalization */}
                <div className="glass-panel p-8 border-neon-cyan/20 bg-neon-cyan/[0.02]">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-white">৳{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span>Sector Transport</span>
                            <span className="text-neon-purple">৳{shippingCost}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                        <span className="text-lg font-black uppercase text-white tracking-tighter">Final Credits</span>
                        <span className="text-4xl font-black text-neon-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] font-heading tracking-wider">৳{finalTotal}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><PackageCheck size={20} /></div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Payment Protocol: Cash on Delivery Enabled</p>
                </div>

                <button 
                  onClick={handlePlaceOrder} disabled={isLoading}
                  className="w-full btn-solid !py-6 shadow-neon-cyan/30 uppercase font-black tracking-widest flex items-center justify-center gap-4"
                >
                  {isLoading ? <Loader2 size={32} className="animate-spin text-dark" /> : <><ShieldCheck size={24} /> INITIALIZE DEPLOYMENT</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center">
            <Link to="/products" className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-neon-cyan transition-colors">
                Aborting Order? Back to Armory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;