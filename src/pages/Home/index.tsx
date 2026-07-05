import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion,  } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  
  
  Zap,
  ArrowRight,
  
  ShoppingCart,
  Loader2,
  Paintbrush,
  
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useProductStore } from '@/store/productStore';
import { db } from '@/services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';

import DigitalClock from '@/components/common/DigitalClock';

const Home: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { products, fetchFeaturedProducts, fetchProducts } = useProductStore();
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  const bestSellers = products.filter(p => (p as any).isBestSeller === true);

  useEffect(() => {
    const initializeHome = async () => {
      setIsHeroLoading(true);
      await Promise.all([fetchProducts(), fetchFeaturedProducts()]);

      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'hero'));
        if (settingsDoc.exists()) {
          const heroId = settingsDoc.data().productId;
          const foundProduct = useProductStore.getState().products.find(p => p.id === heroId);
          if (foundProduct) {
            setHeroProduct(foundProduct);
          }
        }
      } catch (error) {
        console.error("Hero Sync Error:", error);
      } finally {
        setIsHeroLoading(false);
      }
    };

    initializeHome();
  }, [fetchFeaturedProducts, fetchProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>The Mat Hatch | Your Desk. Upgraded.</title>
      </Helmet>

      <main className="relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-5%] left-[-10%] w-[80%] h-[50%] bg-neon-purple/10 blur-[80px] rounded-full"></div>
        </div>

        {/* MOBILE CLOCK */}
        <div className="lg:hidden w-full px-4 pt-24 flex justify-end">
            <div className="w-[40%]">
                <DigitalClock className="bg-dark/40 backdrop-blur-md border-neon-cyan/20 !px-2 !py-2.5 shadow-[0_0_15px_rgba(0,240,255,0.1)]" />
            </div>
        </div>

        <section className="relative min-h-[80vh] flex items-center pt-8 md:pt-32 pb-16 px-4 md:px-10">
          <div className="container mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-12 items-center">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-5xl sm:text-5xl md:text-8xl lg:text-9xl mb-4 leading-[1.1] font-black uppercase tracking-tighter text-white">YOUR DESK. <br /><span className="text-transparent bg-clip-text bg-purple-gradient">UPGRADED.</span></h1>
              <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium uppercase tracking-widest font-heading">Premium 900x400mm extended gaming mousepads with bold artwork.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5">
                <Link to="/products" className="w-full sm:w-auto btn-solid group flex items-center justify-center gap-2 !px-12 !py-4">VIEW ALL GEAR <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link to="/designer" className="w-full sm:w-auto btn-secondary !border-neon-purple text-neon-purple hover:!bg-neon-purple hover:text-white !px-10 !py-4 flex items-center justify-center gap-2 group"><Paintbrush size={18} className="group-hover:rotate-12 transition-transform" /> CUSTOM DESIGN</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative flex justify-center order-1 lg:order-2">
              {isHeroLoading ? (
                <div className="w-full max-w-xs aspect-video flex items-center justify-center"><Loader2 className="text-neon-cyan animate-spin" size={32} /></div>
              ) : heroProduct ? (
                <Link to={`/product/${heroProduct.slug}`} className="block group w-full max-w-[280px] sm:max-w-md">
                  <div className="relative z-10 animate-float">
                    <div className="glass-panel border-white/10 overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_0_30px_rgba(0,240,255,0.1)] group-hover:border-neon-cyan/50 transition-all duration-500">
                        <img src={heroProduct.images[0]?.url} alt={heroProduct.name} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 p-1.5 md:p-2" />
                        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-dark/90 backdrop-blur-md border border-neon-cyan/30 py-3 px-5 rounded-lg md:rounded-2xl flex items-center gap-4 shadow-2xl transform group-hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan"><ShoppingCart size={16} /></div>
                            <div>
                                <p className="hidden md:block text-[8px] font-black uppercase text-gray-500 tracking-widest">Deploy Now</p>
                                <div className="flex flex-col items-start">
                                    {heroProduct.discountPrice && heroProduct.discountPrice < heroProduct.price && (
                                        <div className="relative inline-block w-fit">
                                            {/* LARGER ORIGINAL PRICE */}
                                            <span className="text-sm md:text-lg font-bold text-gray-300">৳{heroProduct.price.toLocaleString()}</span>
                                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#E74C3C] -rotate-12 shadow-[0_0_5px_rgba(231,76,60,0.5)]"></div>
                                        </div>
                                    )}
                                    <span className="text-base md:text-2xl font-black text-white font-heading tracking-wider">৳{(heroProduct.discountPrice || heroProduct.price).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </Link>
              ) : null}
            </motion.div>
          </div>
        </section>

        {/* ... Rest of the page (Best Sellers, Features) stays same ... */}
        <section className="py-16 bg-[#07040A] px-4 md:px-10 overflow-hidden border-t border-white/5">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-neon-cyan mb-3">
                  <Zap size={18} fill="currentColor" /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Top Rated Gear</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">BEST <span className="text-transparent bg-clip-text bg-purple-gradient">SELLERS</span></h2>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-2 text-neon-cyan font-bold uppercase text-sm hover:underline">View Full Armory <ArrowRight size={18} /></Link>
            </div>
            <div className="relative">
              <div className="md:hidden flex justify-end gap-3 mb-6 pr-2">
                <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-90"><ChevronLeft size={24} /></button>
                <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-90"><ChevronRight size={24} /></button>
              </div>
              <div ref={scrollRef} className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {bestSellers.map((product) => (<div key={product.id} className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center"><ProductCard product={product} /></div>))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;