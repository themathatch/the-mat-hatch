import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart,  Eye,  } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-hot-toast';

interface ProductCardProps { product: Product; }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="group relative">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="glass-panel-interactive overflow-hidden bg-[#130C25]/40 border-white/5 group-hover:border-neon-cyan/50 transition-all duration-500 rounded-xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-dark">
            <img src={product.images.find(img => img.isMain)?.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-[#090514]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neon-cyan text-dark flex items-center justify-center shadow-neon-cyan"><Eye size={18} /></div>
            </div>
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNewArrival && <span className="px-2 py-1 bg-neon-cyan text-dark text-[9px] font-black uppercase tracking-widest rounded shadow-neon-cyan">NEW</span>}
              {hasDiscount && <span className="px-2 py-1 bg-[#E74C3C] text-white text-[9px] font-black uppercase tracking-widest rounded">-{discountPercentage}%</span>}
            </div>
          </div>
          <div className="p-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan/70">{product.category}</span>
            <h3 className="text-md font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors truncate">{product.name}</h3>
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col">
                {hasDiscount && (
                  <div className="relative inline-block w-fit mb-0.5">
                    {/* LARGER ORIGINAL PRICE */}
                    <span className="text-sm font-bold text-gray-300">৳{product.price.toLocaleString()}</span>
                    <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#E74C3C] -rotate-12 shadow-[0_0_5px_rgba(231,76,60,0.5)]"></div>
                  </div>
                )}
                <span className="text-xl font-black text-white font-heading leading-none">৳{(product.discountPrice || product.price).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleAddToCart} className="w-full btn-solid !py-2 !text-[10px] flex items-center justify-center gap-2 group/btn">
              <ShoppingCart size={14} /> ADD TO CART
            </button>
          </div>
          <div className="h-0.5 w-0 bg-neon-cyan group-hover:w-full transition-all duration-500"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;