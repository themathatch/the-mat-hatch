import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart,  ChevronRight, ChevronLeft, Loader2, Share2, AlertCircle, ArrowLeft, 
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';
import { toast } from 'react-hot-toast';


const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { fetchProductBySlug } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (slug) {
        setLoading(true);
        const data = await fetchProductBySlug(slug);
        if (data) setProduct(data);
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug, fetchProductBySlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#090514]"><Loader2 className="w-12 h-12 text-neon-cyan animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#090514] px-6 text-center"><AlertCircle size={64} className="text-[#E74C3C] mb-6" /><h2 className="text-3xl font-black uppercase text-white mb-4">ASSET NOT FOUND</h2><Link to="/products" className="btn-primary px-8">Return to Shop</Link></div>;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <>
      <Helmet><title>{product.name} | THE MAT HATCH</title></Helmet>
      <div className="min-h-screen bg-[#090514] pt-24 md:pt-32 pb-20 px-4 md:px-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-colors text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest"><Share2 size={16} /> Share</button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start mb-16 md:mb-24">
            <div className="space-y-6 w-full">
              <div className="relative group">
                <motion.div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel border-white/5 bg-dark/50">
                  <AnimatePresence mode="wait"><motion.img key={currentIndex} src={product.images[currentIndex]?.url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full object-contain p-4 cursor-zoom-in" onClick={() => setIsLightboxOpen(true)} /></AnimatePresence>
                  <button onClick={() => setCurrentIndex((currentIndex - 1 + product.images.length) % product.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-neon-cyan"><ChevronLeft size={20} /></button>
                  <button onClick={() => setCurrentIndex((currentIndex + 1) % product.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-neon-cyan"><ChevronRight size={20} /></button>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col space-y-8">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-[10px] font-black uppercase text-neon-cyan">{product.category}</span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">{product.name}</h1>
                <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-neon-cyan/30 pl-5 italic mb-8">"{product.shortDescription}"</p>
                
                {/* PRICING AREA - MUCH BIGGER FOR MOBILE */}
                <div className="flex flex-col gap-2 mb-10">
                  {hasDiscount && (
                    <div className="relative inline-block w-fit">
                        <span className="text-2xl md:text-3xl font-bold text-gray-400">৳{product.price.toLocaleString()}</span>
                        <div className="absolute top-1/2 left-[-5%] w-[110%] h-[3px] bg-[#E74C3C] -rotate-12 shadow-[0_0_10px_rgba(231,76,60,0.5)]"></div>
                    </div>
                  )}
                  <div className="flex items-center gap-6">
                    <span className="text-5xl md:text-7xl font-black text-white font-heading">৳{(product.discountPrice || product.price).toLocaleString()}</span>
                    <div className="px-4 py-2 rounded-full text-[10px] font-black uppercase border border-green-500/20 bg-green-500/5 text-green-500">{product.totalStock} Units Left</div>
                  </div>
                </div>

                <button onClick={() => addItem(product)} className="w-full btn-solid !py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest"><ShoppingCart size={24} /> Deploy to Battlestation</button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;