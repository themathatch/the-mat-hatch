import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
   
  MapPin, 
  Send,
  Heart,
  ShieldCheck,
  Zap
} from 'lucide-react';

// লোগো ইম্পোর্ট
import logo from '@/assets/logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // সোশ্যাল মিডিয়া লিঙ্ক
  const socialLinks = {
    facebook: "https://facebook.com/TheMatHatch",
    instagram: "https://instagram.com/TheMatHatch",
    twitter: "https://twitter.com/TheMatHatch"
  };

  // কুইক লিঙ্কস
  const quickLinks = [
    { name: 'Home Base', path: '/' },
    { name: 'The Armory', path: '/products' },
    { name: 'Custom Lab', path: '/designer' },
    { name: 'My Profile', path: '/profile' }
  ];

  // সাপোর্ট এবং লিগ্যাল লিঙ্কস (অ্যাডমিন প্যানেলের আইডি অনুযায়ী)
  const supportLinks = [
    { name: 'Privacy Policy', id: 'privacy-policy' },
    { name: 'Terms & Conditions', id: 'terms-conditions' },
    { name: 'Refund Policy', id: 'refund-policy' },
    { name: 'Shipping Policy', id: 'shipping-policy' },
    { name: 'About Us', id: 'about-us' }
  ];

  return (
    <footer className="bg-[#06040C] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand Identity */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 p-0.5 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple">
                <img 
                  src={logo} 
                  alt="The Mat Hatch Logo" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                THE MAT <span className="text-transparent bg-clip-text bg-purple-gradient">HATCH</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Elevating tactical setups across Bangladesh with premium, high-performance extended mousepads. Built for precision, designed for legends.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook size={18} />, url: socialLinks.facebook, color: "hover:bg-[#1877F2]" },
                { icon: <Instagram size={18} />, url: socialLinks.instagram, color: "hover:bg-[#E4405F]" },
                { icon: <Twitter size={18} />, url: socialLinks.twitter, color: "hover:bg-[#1DA1F2]" }
              ].map((social, i) => (
                <a 
                  key={i} href={social.url} target="_blank" rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Zap size={14} className="text-neon-cyan" /> Quick Access
            </h3>
            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-500 hover:text-neon-cyan transition-colors duration-300 text-sm font-bold uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-800 rounded-full group-hover:bg-neon-cyan transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support (LEGAL LINKS) */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <ShieldCheck size={14} className="text-neon-purple" /> Support Protocols
            </h3>
            <ul className="flex flex-col gap-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={`/legal/${link.id}`} 
                    className="text-gray-500 hover:text-white transition-colors duration-300 text-sm font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Transmission (Newsletter) */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Stay Synchronized</h3>
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors">
                <Mail size={16} className="text-neon-cyan" />
                <span className="text-sm font-medium">themathatch@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <MapPin size={16} className="text-neon-purple" />
                <span className="text-sm font-medium">Dhaka, Bangladesh</span>
              </div>
            </div>
            
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Secure Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-cyan transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-neon-cyan rounded-lg flex items-center justify-center hover:shadow-neon-cyan transition-all">
                <Send size={18} className="text-dark" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© {currentYear} THE MAT HATCH COMMAND. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">
              Made with <Heart size={14} className="text-[#E74C3C] fill-[#E74C3C] animate-pulse" /> for Gamers
            </p>
            <div className="w-px h-3 bg-white/10"></div>
            <p>System v2.4.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;