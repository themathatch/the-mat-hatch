import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  ShoppingCart, 
  Search, 
  Terminal,
  
  ArrowRight,
  Target,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';

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

  // নেভিগেশন লিঙ্ক - Custom Design বাটনটি Products এর পরে যুক্ত করা হয়েছে
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Custom Design', path: '/designer', highlight: true }, // Highlighted for attraction
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
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-16 h-16 p-0.5 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple shadow-neon-cyan/20">
                <img 
                  src={logo} 
                  alt="The Mat Hatch Logo" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full animate-pulse -z-10"></div>
            </div>
            
            <h1 className="text-2xl font-black tracking-tighter uppercase flex flex-col leading-none">
              <span className="text-white">THE MAT</span>
              <span className="text-transparent bg-clip-text bg-purple-gradient drop-shadow-[0_0_10px_rgba(157,0,255,0.3)]">
                HATCH
              </span>
            </h1>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10 ml-auto mr-12">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 relative py-1 flex items-center gap-2",
                    isActive ? "text-neon-cyan" : "text-white/80 hover:text-neon-cyan",
                    link.highlight && "text-neon-purple hover:text-neon-purple drop-shadow-[0_0_8px_rgba(157,0,255,0.5)]"
                  )}
                >
                  {link.highlight && <Zap size={14} className="animate-pulse" />}
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-neon-cyan transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                    link.highlight && "bg-neon-purple"
                  )}></span>
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group relative overflow-hidden"
            >
              <Search size={20} className="text-white group-hover:text-neon-cyan transition-colors relative z-10" />
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group"
            >
              <ShoppingCart size={20} className="text-white group-hover:text-neon-cyan transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-cyan text-dark text-[10px] font-black flex items-center justify-center rounded-full shadow-neon-cyan">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Account Button */}
            <Link 
              to={user ? "/profile" : "/login"} 
              className="hidden md:flex items-center gap-2 btn-secondary !py-2.5 !px-5 !text-[10px] !border-white/10 hover:!border-neon-cyan group"
            >
              {user ? (
                <>
                  <User size={14} className="text-neon-cyan" />
                  <span className="font-bold tracking-widest uppercase">{profile?.displayName?.split(' ')[0] || 'ACCOUNT'}</span>
                </>
              ) : (
                <>
                  <LogIn size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  <span className="font-bold tracking-widest uppercase">LOGIN</span>
                </>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden p-2 text-white hover:text-neon-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
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
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-4 rounded-xl bg-white/5 text-white hover:bg-neon-pink transition-all">
              <X size={32} />
            </button>

            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-5xl relative">
              <div className="flex flex-col gap-2 mb-10">
                <div className="flex items-center gap-3 text-neon-cyan">
                  <Terminal size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Search Protocol</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                  SEARCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">COMMAND</span>
                </h2>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative">
                <Target className="absolute -left-6 top-1/2 -translate-y-1/2 text-neon-cyan animate-pulse" size={32} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter tactical keyword..."
                  className="w-full bg-white/5 border-b-2 border-neon-cyan py-10 px-8 text-4xl md:text-6xl font-black text-white placeholder:text-gray-800 focus:outline-none focus:bg-white/10 transition-all"
                />
                <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-neon-cyan hover:scale-125 transition-transform">
                  <ArrowRight size={60} />
                </button>
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
                className="lg:hidden fixed inset-0 z-[110] bg-[#090514]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            >
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={35} /></button>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "text-3xl font-black uppercase tracking-widest",
                            location.pathname === link.path ? "text-neon-cyan" : "text-white"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
                <Link 
                    to={user ? "/profile" : "/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-solid px-12 text-xl mt-4 flex items-center gap-3"
                >
                    {user ? "MY ACCOUNT" : "LOGIN"}
                </Link>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;