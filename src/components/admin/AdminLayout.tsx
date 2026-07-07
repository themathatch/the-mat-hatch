import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  ExternalLink,
  ShieldCheck,
  Sliders,
  Terminal
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import DigitalClock from '@/components/common/DigitalClock';

const AdminLayout: React.FC = () => {
  // মোবাইলে ডিফল্টভাবে সাইডবার বন্ধ থাকবে
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();

  // উইন্ডো রিসাইজ হলে সাইডবার অটো অ্যাডজাস্ট হবে
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // মোবাইলে লিঙ্ক ক্লিক করলে সাইডবার অটো বন্ধ হবে
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Product Management', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Order Logs', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Customer Database', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Sales Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <Sliders size={20} /> },
    { name: 'Legal & Policies', path: '/admin/legal', icon: <FileText size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('Admin Session Terminated');
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-[#06040C] text-white flex overflow-hidden">
      
      {/* MOBILE BACKDROP (সাইডবার ওপেন থাকলে পেছনে ক্লিক করলে বন্ধ হবে) */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside 
        className={cn(
          "fixed lg:relative z-[150] h-full bg-[#090514] border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0",
          isSidebarOpen 
            ? "translate-x-0 w-72" 
            : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan/20 flex-shrink-0">
                <ShieldCheck size={24} className="text-dark" />
              </div>
              {(isSidebarOpen || window.innerWidth <= 1024) && (
                <span className="font-black uppercase tracking-tighter text-xl">
                  Admin <span className="text-neon-cyan">Panel</span>
                </span>
              )}
            </div>
            {/* Mobile Close Button */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500">
                <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow overflow-y-auto px-4 space-y-2 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative",
                    isActive ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className={cn("flex-shrink-0", isActive ? "text-neon-cyan" : "group-hover:text-neon-cyan")}>{item.icon}</span>
                  {(isSidebarOpen || window.innerWidth <= 1024) && (
                    <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Fixed Actions */}
          <div className="p-4 border-t border-white/5 bg-[#090514] space-y-2 mt-auto">
            <Link to="/" target="_blank" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-neon-purple transition-all group">
              <ExternalLink size={20} />
              {(isSidebarOpen || window.innerWidth <= 1024) && <span className="text-xs font-bold uppercase tracking-widest">Live Store</span>}
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-neon-pink hover:bg-neon-pink/5 rounded-xl transition-all text-left">
              <LogOut size={20} />
              {(isSidebarOpen || window.innerWidth <= 1024) && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col h-full overflow-hidden w-full">
        
        {/* Top bar */}
        <header className="h-20 bg-[#090514]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal size={10} className="text-neon-cyan" /> Mission Control
              </p>
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-white truncate max-w-[150px]">
                {profile?.displayName || 'Admin'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <DigitalClock className="hidden sm:flex border-neon-purple/20" />
            <button className="relative p-2 text-gray-500 hover:text-neon-cyan transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full shadow-neon-pink animate-pulse"></span>
            </button>
            <div className="w-px h-8 bg-white/5 hidden xs:block"></div>
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan">
              <Settings size={20} className="animate-[spin_5s_linear_infinite]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;