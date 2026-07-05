import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Zap, 
  Plus, 
  Minus,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Share2,
  AlertCircle,
  ArrowLeft,
  X,
  Maximize2,
  FileText
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
  const [quantity, setQuantity] = useState(1);
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
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast.success(`${quantity} x ${product.name} deployed to battlestation!`);
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
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">ASSET NOT FOUND</h2>
        <Link to="/products" className="btn-primary px-8">Return to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <>
      <Helmet>
        <title>{product.name} | THE MAT HATCH</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Back & Share Buttons */}
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Armory
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to terminal!');
            }} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
              <Share2 size={16} /> Share Gear
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
            
            {/* Left: Swappable Gallery */}
            <div className="space-y-6">
              <div className="relative group">
                <motion.div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel border-white/5 bg-dark/50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      src={product.images[currentIndex]?.url}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-contain p-4 cursor-zoom-in"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  </AnimatePresence>

                  <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-cyan">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-cyan">
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, i) => (
                      <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === currentIndex ? "bg-neon-cyan w-4 shadow-neon-cyan" : "bg-white/20")} />
                    ))}
                  </div>

                  <button onClick={() => setIsLightboxOpen(true)} className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white hover:text-neon-cyan">
                    <Maximize2 size={20} />
                  </button>
                </motion.div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                      currentIndex === i ? "border-neon-cyan shadow-neon-cyan/20 scale-95" : "border-white/5 opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-cyan">{product.category}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-400">{product.averageRating} ({product.totalReviews})</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
                  {product.name}
                </h1>

                {/* Short Desc */}
                <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-neon-cyan/30 pl-6 italic">
                  "{product.shortDescription}"
                </p>

                {/* PRICING AREA - MUCH BIGGER ORIGINAL PRICE */}
                <div className="flex items-center gap-8 mb-10">
                  <div className="flex flex-col">
                    {hasDiscount && (
                      <div className="relative inline-block w-fit mb-2">
                        {/* BIGGER AND BOLDER ORIGINAL PRICE */}
                        <span className="text-2xl md:text-3xl font-bold text-gray-300">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {/* High Visibility Tactical Red Line */}
                        <div className="absolute top-1/2 left-[-5%] w-[110%] h-[3px] bg-[#E74C3C] -rotate-12 shadow-[0_0_8px_rgba(231,76,60,0.6)]"></div>
                      </div>
                    )}
                    <span className="text-5xl md:text-6xl font-black text-white font-heading tracking-wider leading-none">
                      ৳{(product.discountPrice || product.price).toLocaleString()}
                    </span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    product.totalStock > 0 ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-[#E74C3C] border-[#E74C3C]/20 bg-[#E74C3C]/5"
                  )}>
                    {product.totalStock > 0 ? `${product.totalStock} Units Left` : 'Out of Stock'}
                  </div>
                </div>

                <div className="mb-10 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-neon-purple shadow-neon-purple/20"><Zap size={20} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dimension</p>
                      <p className="text-sm font-bold text-white uppercase tracking-tighter">900x400mm Extended XL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Surface</p>
                    <p className="text-sm font-bold text-neon-cyan uppercase tracking-tighter">Elite Control</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center bg-[#130C25] border border-white/10 rounded-xl p-1.5 w-full sm:w-auto">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-white transition-colors"><Minus size={18} /></button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-white transition-colors"><Plus size={18} /></button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.totalStock === 0}
                    className="w-full btn-solid !py-4 flex-grow flex items-center justify-center gap-3 shadow-neon-cyan/20 font-black uppercase"
                  >
                    <ShoppingCart size={20} /> Deploy to battlestation
                  </button>
                  <button className="p-4 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-neon-pink transition-all"><Heart size={20} /></button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full Width Long Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-cyan/10 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative glass-panel p-8 md:p-12 border-white/10 bg-white/[0.02] backdrop-blur-2xl rounded-3xl overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-neon-cyan/10 text-neon-cyan">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white">Full Tactical Report</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Detailed Technical Specifications</p>
                </div>
              </div>
              <div className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium max-w-none">
                {product.description || "System database is waiting for full tactical specifications of this unit."}
              </div>
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/5 rounded-tl-xl"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/5 rounded-br-xl"></div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Full Screen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-10 right-10 p-4 text-white hover:text-[#E74C3C] transition-all z-[1010]"><X size={40} /></button>
            <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/5 text-white hover:bg-neon-cyan transition-all z-[1010]"><ChevronLeft size={32} /></button>
            <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/5 text-white hover:bg-neon-cyan transition-all z-[1010]"><ChevronRight size={32} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full h-full flex items-center justify-center p-12">
              <AnimatePresence mode="wait">
                <motion.img key={currentIndex} src={product.images[currentIndex]?.url} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="max-w-full max-h-full object-contain drop-shadow-[0_0_80px_rgba(0,240,255,0.25)]" />
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;