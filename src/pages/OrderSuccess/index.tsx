import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Package, 
   
  Home, 
  Mail, 
  ShieldCheck,
  Zap,
  Truck
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import confetti from 'canvas-confetti';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // Trigger celebration effect on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#00F0FF', '#9D00FF'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#00F0FF', '#9D00FF'] });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Deployment Successful | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl relative z-10"
        >
          <div className="glass-panel p-8 md:p-12 border-white/10 text-center relative overflow-hidden">
            {/* Top Success Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan animate-pulse"></div>

            {/* Success Icon */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-8 relative"
            >
              <CheckCircle2 size={48} className="text-neon-cyan" />
              <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full animate-pulse"></div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4"
            >
              MISSION <span className="text-transparent bg-clip-text bg-purple-gradient">ACCOMPLISHED</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-heading tracking-[0.2em] uppercase text-sm mb-10"
            >
              Order Deployment ID: <span className="text-neon-cyan font-bold">#{orderId?.slice(-8).toUpperCase()}</span>
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <Mail className="text-neon-purple mx-auto mb-3" size={24} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Confirmation Sent</p>
                <p className="text-xs text-white mt-1">Check your Gmail</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <Truck className="text-neon-cyan mx-auto mb-3" size={24} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</p>
                <p className="text-xs text-white mt-1">Preparing Transport</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck className="text-green-500 mx-auto mb-3" size={24} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Payment</p>
                <p className="text-xs text-white mt-1">Cash on Delivery</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                to="/" 
                className="w-full btn-solid !py-4 flex items-center justify-center gap-3 group shadow-neon-cyan/20"
              >
                <Home size={18} />
                RETURN TO BASE (HOME)
              </Link>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="flex-1 btn-secondary !py-3 flex items-center justify-center gap-2 text-xs"
                >
                  <Package size={16} />
                  BROWSE MORE GEAR
                </Link>
                <Link 
                  to="/profile" 
                  className="flex-1 border border-white/10 hover:border-white/30 rounded-xl py-3 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Zap size={16} className="text-neon-purple" />
                  TRACK ORDER
                </Link>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
              <Zap size={12} className="text-neon-cyan" />
              Thank you for choosing The Mat Hatch
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;