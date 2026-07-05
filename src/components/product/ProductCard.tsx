import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye, 
  Zap
} from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  // Discount calculation
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        border: '1px solid #00F0FF',
        padding: '16px',
        color: '#00F0FF',
      },
      iconTheme: {
        primary: '#00F0FF',
        secondary: '#130C25',
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="glass-panel-interactive overflow-hidden bg-[#130C25]/40 border-white/5 group-hover:border-neon-cyan/50 transition-all duration-500 rounded-xl">
          
          {/* Image Area */}
          <div className="relative aspect-[4/3] overflow-hidden bg-dark">
            <img
              src={product.images.find(img => img.isMain)?.url || "https://placehold.co/600x450/130C25/00F0FF?text=Mousepad"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-[#090514]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <button className="w-10 h-10 rounded-full bg-dark/80 border border-white/10 flex items-center justify-center text-white hover:bg-[#E74C3C] hover:border-[#E74C3C] transition-all">
                <Heart size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-neon-cyan text-dark flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <Eye size={18} />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="px-2 py-1 bg-neon-cyan text-dark text-[9px] font-black uppercase tracking-widest rounded shadow-neon-cyan">
                  NEW
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-1 bg-[#E74C3C] text-white text-[9px] font-black uppercase tracking-widest rounded">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Product Content */}
          <div className="p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan/70">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={10} fill="currentColor" />
                <span className="text-[10px] font-bold text-gray-400">{product.averageRating}</span>
              </div>
            </div>

            <h3 className="text-md font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors truncate">
              {product.name}
            </h3>

            {/* Pricing */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-[10px] text-gray-500 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-xl font-black text-white font-heading">
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Zap size={12} className="text-neon-purple" />
                <span>Speed</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full btn-solid !py-2 !text-[10px] flex items-center justify-center gap-2 group/btn"
            >
              <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
              ADD TO CART
            </button>
          </div>

          {/* Bottom Neon Line */}
          <div className="h-0.5 w-0 bg-neon-cyan group-hover:w-full transition-all duration-500"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;