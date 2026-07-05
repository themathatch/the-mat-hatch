import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Eye,
  EyeOff,
  Chrome,
  Github,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, } from 'firebase/firestore';
import { auth, db } from '@/services/firebase/config';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

// এখানে আপনার মাস্টার অ্যাডমিন ইমেইলটি বসান (লগইন পেজের সাথে মিল থাকতে হবে)
const MASTER_ADMIN_EMAIL = 'mask00241@gmail.com'; 

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Complete all tactical fields!');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Access keys do not match!');
      return;
    }
    if (password.length < 6) {
      toast.error('Key must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, { displayName: name });

      // 3. MASTER ADMIN CHECK - Determine Role
      const isAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
      const userRole = isAdmin ? 'admin' : 'user';

      // 4. Create profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email.toLowerCase(),
        role: userRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 5. Success Notification & Redirect
      if (isAdmin) {
        toast.success('Master Admin Verified. Granting Access...', {
          icon: <ShieldAlert className="text-neon-cyan" />,
          duration: 5000
        });
        navigate('/admin');
      } else {
        toast.success('Gamer Identity Created! Welcome to base.');
        navigate('/');
      }

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Signal already exists (Email in use)' 
        : 'Deployment Failed. System Overload.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Master Admin Check for Google Users
      const isAdmin = user.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
      const userRole = isAdmin ? 'admin' : 'user';

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email?.toLowerCase(),
        photoURL: user.photoURL,
        role: userRole,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      if (isAdmin) {
        toast.success('Master Admin Detected via Google Sync.');
        navigate('/admin');
      } else {
        toast.success('Identity Synchronized.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Google Sync Failed.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Initialize Profile | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-28 relative overflow-hidden bg-[#090514]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="glass-panel p-8 md:p-12 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-purple/20 mb-4 border border-neon-purple/30">
                <ShieldCheck className="text-neon-purple" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                JOIN THE <span className="text-neon-purple">HATCH</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase">
                Initialize gamer credentials
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Combat Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-purple transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-purple transition-all"
                    placeholder="Full Name" required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Secure Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-purple transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-purple transition-all"
                    placeholder="gamer@example.com" required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Access Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-purple transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-purple transition-all"
                      placeholder="••••••" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-neon-purple transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#130C25]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-purple transition-all"
                      placeholder="••••••" required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full btn-secondary !bg-neon-purple/10 hover:!bg-neon-purple flex items-center justify-center gap-2 py-4 mt-4 group font-black"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                  <>INITIALIZE IDENTITY <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#130C25] px-4 text-gray-600 tracking-[0.3em]">Quick Sync</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGoogleSignup} className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <Chrome size={18} className="group-hover:text-neon-cyan transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <Github size={18} className="group-hover:text-neon-purple transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">GitHub</span>
              </button>
            </div>

            <p className="mt-10 text-center text-xs text-gray-600 uppercase font-heading tracking-[0.2em]">
              Already Active? <Link to="/login" className="text-neon-purple font-black hover:underline ml-1">Log In Here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;