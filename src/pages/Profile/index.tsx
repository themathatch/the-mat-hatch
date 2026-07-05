import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut, 
  Package, 
  Heart, 
  Settings,
  Camera,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Profile: React.FC = () => {
  const { user, profile, loading, logout } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar: User Quick Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="glass-panel p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-gradient"></div>
                
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-neon-cyan to-neon-purple">
                    <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-neon-cyan rounded-full text-dark hover:scale-110 transition-transform shadow-lg">
                    <Camera size={14} />
                  </button>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                  {profile?.displayName || 'Gamer User'}
                </h2>
                <p className="text-neon-cyan text-xs font-heading font-bold tracking-[0.2em] uppercase mb-6">
                  Elite Member
                </p>

                <div className="flex justify-center gap-4 border-t border-white/5 pt-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">0</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Orders</p>
                  </div>
                  <div className="w-px h-10 bg-white/5"></div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">0</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Wishlist</p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="glass-panel overflow-hidden">
                <div className="flex flex-col">
                  {[
                    { icon: <Package size={18} />, label: 'My Orders', path: '/orders' },
                    { icon: <Heart size={18} />, label: 'Wishlist', path: '/wishlist' },
                    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
                  ].map((item) => (
                    <button 
                      key={item.label}
                      className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-neon-cyan hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest border-b border-white/5 last:border-0"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-4 text-neon-pink hover:bg-neon-pink/10 transition-all text-sm font-bold uppercase tracking-widest"
                  >
                    <LogOut size={18} />
                    Logout Session
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Account Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="glass-panel p-8 md:p-10">
                <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Shield className="text-neon-cyan" size={24} />
                  Account Security
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Email Info */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Email Address</p>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <Mail size={18} className="text-neon-cyan" />
                      <span className="text-white font-medium">{user?.email}</span>
                    </div>
                  </div>

                  {/* Role Info */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Account Type</p>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <Shield size={18} className="text-neon-purple" />
                      <span className="text-white font-medium uppercase tracking-widest">
                        {profile?.role || 'User'}
                      </span>
                    </div>
                  </div>

                  {/* Join Date Info */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Member Since</p>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <Calendar size={18} className="text-neon-pink" />
                      <span className="text-white font-medium">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Account Status</p>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-white font-medium uppercase tracking-widest">Active & Secure</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-neon-cyan/10 to-transparent border border-neon-cyan/20">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">Complete Your Profile</h4>
                      <p className="text-sm text-gray-400">Add your shipping address to speed up your next checkout.</p>
                    </div>
                    <button className="btn-solid !py-2 !px-6 text-xs whitespace-nowrap">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity Placeholder */}
              <div className="glass-panel p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black uppercase tracking-widest">Recent Activity</h3>
                  <button className="text-neon-cyan text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:underline">
                    View All <ExternalLink size={14} />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Package size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-heading tracking-widest uppercase text-sm">No recent orders found</p>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="mt-6 text-neon-cyan font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;