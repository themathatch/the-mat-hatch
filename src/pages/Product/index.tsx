import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  
  Zap, 
   
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Share2, 
  AlertCircle, 
  ArrowLeft, 
  X, 
  Maximize2
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { fetchProductBySlug } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (slug) {
        setLoading(true);
        const data = await fetchProductBySlug(slug);
        if (data) {
          setProduct(data);
        }
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug, fetchProductBySlug]);

  const handleNext = () => {
    if (!product) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrev = () => {
    if (!product) return;
    setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success(`${product.name} deployed to battlestation!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090514]">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090514] px-6 text-center">
        <AlertCircle size={64} className="text-[#E74C3C] mb-6" />
        <h2 className="text-3xl font-black uppercase text-white mb-4">ASSET NOT FOUND</h2>
        <Link to="/products" className="btn-primary px-8">Return to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <>
      <Helmet>
        <title>{product.name} | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-24 md:pt-32 pb-20 px-4 md:px-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Navigation */}
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
              <Share2 size={16} /> Share Gear
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start mb-20">
            
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative group">
                <motion.div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel border-white/5 bg-dark/50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      src={product.images[currentIndex]?.url}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-contain p-4 cursor-zoom-in"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  </AnimatePresence>

                  <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-neon-cyan hover:text-dark">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-neon-cyan hover:text-dark">
                    <ChevronRight size={24} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all", 
                          i === currentIndex ? "bg-neon-cyan w-4 shadow-neon-cyan" : "bg-white/20"
                        )} 
                      />
                    ))}
                  </div>

                  <button onClick={() => setIsLightboxOpen(true)} className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white hover:text-neon-cyan transition-colors">
                    <Maximize2 size={20} />
                  </button>
                </motion.div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar justify-start md:justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                      currentIndex === i ? "border-neon-cyan shadow-neon-cyan/20" : "border-white/5 opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-[10px] font-black uppercase tracking-widest text-neon-cyan mb-2 block">{product.category}</span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">{product.name}</h1>
                
                <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-neon-cyan/30 pl-5 italic mb-8">"{product.shortDescription}"</p>

                {/* Pricing Area */}
                <div className="flex flex-col gap-4 mb-10">
                  {hasDiscount && (
                    <div className="relative inline-block w-fit">
                        {/* BIGGER AND BOLDER ORIGINAL PRICE */}
                        <span className="text-2xl md:text-3xl font-bold text-gray-400">৳{product.price.toLocaleString()}</span>
                        {/* Tactical Red Slash */}
                        <div className="absolute top-1/2 left-[-5%] w-[110%] h-[3px] bg-[#E74C3C] -rotate-12 shadow-[0_0_10px_rgba(231,76,60,0.5)]"></div>
                    </div>
                  )}
                  <div className="flex items-center gap-6">
                    <span className="text-5xl md:text-7xl font-black text-white font-heading">৳{(product.discountPrice || product.price).toLocaleString()}</span>
                    <div className="px-4 py-2 rounded-full text-[10px] font-black uppercase border border-green-500/20 bg-green-500/5 text-green-500">{product.totalStock} Units Available</div>
                  </div>
                </div>

                <div className="mb-10 p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-neon-purple shadow-neon-purple/20"><Zap size={20} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Size Format</p>
                      <p className="text-sm font-bold text-white uppercase">900x400mm Extended XL</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.totalStock === 0}
                  className="w-full btn-solid !py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-neon-cyan/20"
                >
                  <ShoppingCart size={24} /> Deploy to Battlestation
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-10 right-10 p-4 text-white hover:text-[#E74C3C] transition-all z-[1010]"><X size={40} /></button>
            <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/5 text-white hover:bg-neon-cyan transition-all z-[1010]"><ChevronLeft size={32} /></button>
            <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/5 text-white hover:bg-neon-cyan transition-all z-[1010]"><ChevronRight size={32} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full flex items-center justify-center p-12">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentIndex} 
                  src={product.images[currentIndex]?.url} 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(0,240,255,0.2)]" 
                />
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;