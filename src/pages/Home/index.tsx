import React, { useEffect,  useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {  Link } from 'react-router-dom';
import { 
  ChevronRight, 
  MousePointer2, 
  ShieldCheck, 
  Globe,
  Zap,
  ArrowRight,
  Star,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useProductStore } from '@/store/productStore';
import { db } from '@/services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';

const Home: React.FC = () => {
  
  const { products, fetchFeaturedProducts, fetchProducts,  } = useProductStore();
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  // Best Sellers Filter (Only products marked as best sellers in the future)
  // For now, it filters from products list
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

  return (
    <>
      <Helmet>
        <title>The Mat Hatch | Your Desk. Upgraded.</title>
      </Helmet>

      <main className="relative w-full overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[100px] rounded-full"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 px-6">
          <div className="container mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 leading-tight font-black tracking-tighter text-white">
                YOUR DESK. <br />
                <span className="text-transparent bg-clip-text bg-purple-gradient">
                  UPGRADED.
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium uppercase tracking-widest font-heading">
                Premium 900x400mm extended gaming mousepads with bold artwork — built for serious gamers.
              </p>
              
              <div className="flex flex-wrap gap-5">
                {/* Updated Button: Shop Now removed, View All Gear moved here with Cyan color */}
                <Link to="/products" className="btn-solid group flex items-center gap-2 !px-12">
                  VIEW ALL GEAR
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/designer" className="btn-secondary !px-10 flex items-center justify-center">
                  CUSTOM DESIGN
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap gap-8 items-center border-t border-white/5 pt-8 text-gray-500">
                <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-neon-purple" /><span className="text-xs font-bold uppercase tracking-widest">Premium Quality</span></div>
                <div className="flex items-center gap-2"><Globe size={18} className="text-neon-cyan" /><span className="text-xs font-bold uppercase tracking-widest">Nationwide Shipping</span></div>
                <div className="flex items-center gap-2"><MousePointer2 size={18} className="text-neon-pink" /><span className="text-xs font-bold uppercase tracking-widest">Ultra Smooth Glide</span></div>
              </div>
            </motion.div>

            {/* Dynamic Hero Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:flex justify-center"
            >
              {isHeroLoading ? (
                <div className="w-full max-w-md aspect-video flex items-center justify-center"><Loader2 className="text-neon-cyan animate-spin" size={40} /></div>
              ) : heroProduct ? (
                <Link to={`/product/${heroProduct.slug}`} className="block group w-full max-w-md">
                  <div className="relative z-10 animate-float">
                    <div className="glass-panel border-white/10 overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.1)] group-hover:border-neon-cyan/50 transition-all duration-500">
                        <img src={heroProduct.images[0]?.url} alt={heroProduct.name} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 p-2" />
                        
                        {/* Dynamic Floating Price Tag with Original & Discount Price */}
                        <div className="absolute bottom-6 right-6 bg-dark/90 backdrop-blur-md border border-neon-cyan/30 py-3 px-5 rounded-2xl flex items-center gap-4 shadow-2xl transform group-hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan"><ShoppingCart size={20} /></div>
                            <div>
                                <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Deploy Gear</p>
                                <div className="flex items-baseline gap-2">
                                    {heroProduct.discountPrice && heroProduct.discountPrice < heroProduct.price && (
                                        <span className="text-[10px] text-gray-600 line-through">৳{heroProduct.price.toLocaleString()}</span>
                                    )}
                                    <span className="text-xl font-black text-white font-heading tracking-wider">
                                        ৳{(heroProduct.discountPrice || heroProduct.price).toLocaleString()}
                                    </span>
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

        {/* Best Sellers Section (Separated from Featured) */}
        <section className="py-24 bg-[#07040A] px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 text-neon-cyan mb-4">
                  <Zap size={18} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Top Rated Gear</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  BEST <span className="text-transparent bg-clip-text bg-purple-gradient">SELLERS</span>
                </h2>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-neon-cyan font-bold uppercase tracking-widest text-sm hover:underline group">
                View Full Armory <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellers.length > 0 ? (
                bestSellers.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full py-20 text-center glass-panel border-dashed border-white/5 uppercase tracking-[0.4em] text-gray-600">No Best Sellers Deployed Yet</div>
              )}
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section className="py-24 border-t border-white/5 px-6">
            <div className="container mx-auto grid md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-6 text-neon-cyan group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Speed Surface</h3>
                    <p className="text-gray-500 text-sm">Lightning-fast glides and pinpoint control for competitive gaming.</p>
                </div>
                <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 rounded-lg bg-neon-purple/10 flex items-center justify-center mb-6 text-neon-purple group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Anti-Fraying</h3>
                    <p className="text-gray-500 text-sm">Thick double-stitched edges ensure your mat lasts for years.</p>
                </div>
                <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 rounded-lg bg-neon-pink/10 flex items-center justify-center mb-6 text-neon-pink group-hover:scale-110 transition-transform"><Star size={24} /></div>
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Zero Fade</h3>
                    <p className="text-gray-500 text-sm">High-resolution printing that stays vibrant even after heavy usage.</p>
                </div>
            </div>
        </section>
      </main>
    </>
  );
};

export default Home;