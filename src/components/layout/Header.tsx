import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import DigitalClock from '@/components/common/DigitalClock';

// লোগো ইম্পোর্ট
import logo from '@/assets/logo.png'; 

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { user, profile } = useAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const { searchProducts } = useProductStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
      setIsSearchOpen(false);
      navigate('/products');
      setSearchQuery('');
    }
  };

  // নেভিগেশন লিঙ্কগুলো (Home এবং Products এখন আবার যুক্ত করা হয়েছে)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Custom Design', path: '/designer', highlight: true },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-300",
          isScrolled 
            ? "bg-[#090514]/95 backdrop-blur-md py-3 shadow-[0_0_30px_rgba(0,0,0,0.6)] border-b border-white/5" 
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* 1. Left Side: Logo & Brand */}
          <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 p-0.5 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple shadow-neon-cyan/20">
                <img 
                  src={logo} 
                  alt="The Mat Hatch Logo" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full animate-pulse -z-10"></div>
            </div>
            
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex flex-col leading-none">
              <span className="text-white">THE MAT</span>
              <span className="text-transparent bg-clip-text bg-purple-gradient">HATCH</span>
            </h1>
          </Link>

          {/* 2. Middle Section: Navigation Links (Back in place) */}
          <nav className="hidden lg:flex items-center gap-10 ml-auto mr-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 relative py-1 flex items-center gap-2",
                    isActive ? "text-neon-cyan" : "text-white/80 hover:text-neon-cyan",
                    link.highlight && "text-neon-purple hover:text-neon-purple"
                  )}
                >
                  {link.highlight && <Zap size={14} className="animate-pulse" />}
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                    link.highlight ? "bg-neon-purple shadow-neon-purple" : "bg-neon-cyan shadow-neon-cyan"
                  )}></span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Side: HUD Action Icons (As per screenshot) */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Tactical Digital Clock */}
            <DigitalClock className="hidden xl:flex mr-1 border-white/10 bg-white/[0.02]" />

            {/* Search Box */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan transition-all group"
            >
              <Search size={20} className="text-white group-hover:text-neon-cyan" />
            </button>

            {/* Cart Box */}
            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan transition-all group"
            >
              <ShoppingCart size={20} className="text-white group-hover:text-neon-cyan" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-cyan text-dark text-[10px] font-black flex items-center justify-center rounded-full shadow-neon-cyan">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* ADMIN Button (Text Only, Outlined Box) */}
            <Link 
              to={user ? "/profile" : "/login"} 
              className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-xl border border-white/10 bg-transparent hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all"
            >
              <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">
                {user ? (profile?.role === 'admin' ? 'ADMIN' : 'ACCOUNT') : 'LOGIN'}
              </span>
            </Link>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden p-2 text-white hover:text-neon-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#090514]/98 backdrop-blur-3xl flex items-center justify-center px-6"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-4 rounded-xl bg-white/5 text-white hover:bg-neon-pink transition-all"><X size={32} /></button>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-5xl relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Target className="absolute -left-6 top-1/2 -translate-y-1/2 text-neon-cyan animate-pulse" size={32} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Initiating Neural Search..."
                  className="w-full bg-white/5 border-b-2 border-neon-cyan py-8 px-6 text-2xl md:text-6xl font-black text-white outline-none focus:bg-white/10"
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                className="lg:hidden fixed inset-0 z-[110] bg-[#090514]/98 backdrop-blur-xl flex flex-col p-8 pt-24"
            >
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={28} /></button>
                <div className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className={cn(
                          "p-5 rounded-2xl border text-xl font-black uppercase tracking-widest",
                          location.pathname === link.path 
                            ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan" 
                            : "bg-white/5 border-white/5 text-white"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                </div>
                <div className="mt-auto">
                    <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="btn-solid !py-5 text-xl w-full flex items-center justify-center gap-3">{user ? "PROFILE" : "LOGIN"}</Link>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;