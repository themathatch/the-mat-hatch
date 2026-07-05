import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();

  // Updated Navigation Links with "Site Settings"
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Product Management', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Order Logs', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Customer Database', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Sales Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <Sliders size={20} /> }, // New Hero Settings option
    { name: 'Legal & Policies', path: '/admin/legal', icon: <FileText size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('Admin Session Terminated');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#06040C] text-white flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed lg:relative z-[150] h-screen bg-[#090514] border-r border-white/5 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-0 lg:w-20 overflow-hidden lg:overflow-visible"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Admin Logo */}
          <div className="flex items-center gap-3 px-2 mb-10 mt-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan/20 flex-shrink-0">
              <ShieldCheck size={24} className="text-dark" />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-black uppercase tracking-tighter text-xl"
              >
                Admin <span className="text-neon-cyan">Panel</span>
              </motion.span>
            )}
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" 
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className={cn("flex-shrink-0", isActive ? "text-neon-cyan" : "group-hover:text-neon-cyan")}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 w-1 h-6 bg-neon-cyan rounded-l-full shadow-neon-cyan"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <Link to="/" target="_blank" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-neon-purple transition-all group">
              <ExternalLink size={20} className="group-hover:text-neon-purple" />
              {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Live Store</span>}
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-3 w-full text-neon-pink hover:bg-neon-pink/5 rounded-xl transition-all"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        
        {/* Admin Top bar */}
        <header className="h-20 bg-[#090514]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-neon-cyan transition-all"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Operational Status</p>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                Operative: {profile?.displayName || 'Admin'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:text-neon-cyan transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full shadow-neon-pink animate-pulse"></span>
            </button>
            <div className="w-px h-8 bg-white/5"></div>
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan">
              <Settings size={20} className="animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[140]"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;