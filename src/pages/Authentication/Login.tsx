import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Chrome, 
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  ShieldAlert
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

// এখানে আপনার মাস্টার অ্যাডমিন ইমেইলটি বসান
const MASTER_ADMIN_EMAIL = 'mask00241@gmail.com'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Tactical fields missing!');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // MASTER ADMIN REDIRECT LOGIC
      if (user.email === MASTER_ADMIN_EMAIL) {
        toast.success('Admin Credentials Verified. Entering Command Center...', {
            icon: <ShieldAlert className="text-neon-cyan" />,
            duration: 4000
        });
        navigate('/admin');
      } else {
        toast.success('Identity Verified. Welcome back to base!');
        navigate('/');
      }

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid Access Code or Email' 
        : 'Connection Failed. System Overload.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Google লগইনের ক্ষেত্রেও মাস্টার এডমিন চেক
      if (user.email === MASTER_ADMIN_EMAIL) {
        toast.success('Admin Signal Detected. Redirecting to Command Center...');
        navigate('/admin');
      } else {
        toast.success('Authentication Successful!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Neural Sync Failed.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Identity Verification | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-[#090514]">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 md:p-10 border-white/5 relative overflow-hidden">
            {/* Top Neon Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">
                VERIFY <span className="text-neon-cyan font-heading">IDENTITY</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase">
                Synchronizing Battlestation
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Secure Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-cyan transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all placeholder:text-gray-700"
                    placeholder="Enter email base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Access Key</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-[9px] font-black text-neon-purple uppercase hover:text-neon-cyan transition-colors tracking-widest"
                  >
                    Forgot Key?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-cyan transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white focus:outline-none focus:border-neon-cyan transition-all placeholder:text-gray-700"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-solid flex items-center justify-center gap-2 py-4 shadow-neon-cyan/20 group font-black"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    INITIALIZE LOGIN
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#130C25] px-4 text-gray-600 tracking-[0.4em]">Alternative Sync</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-neon-cyan/20 transition-all group"
              >
                <Chrome size={18} className="group-hover:text-neon-cyan transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-neon-purple/20 transition-all group">
                <Github size={18} className="group-hover:text-neon-purple transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">GitHub</span>
              </button>
            </div>

            <p className="mt-10 text-center text-xs text-gray-600 uppercase font-heading tracking-[0.2em]">
              New Operative?{' '}
              <Link to="/register" className="text-neon-cyan font-black hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;