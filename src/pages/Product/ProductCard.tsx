import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye, 
  Zap,
  
} from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Discount percentage calculation
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to cart!`);
    // Add to cart logic will be added when we create cartStore
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to wishlist!`);
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
        <div className="glass-panel-interactive overflow-hidden bg-dark-card/40 border-white/5 group-hover:border-neon-cyan/50 transition-all duration-500">
          
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.images.find(img => img.isMain)?.url || "https://placehold.co/600x450/130C25/00F0FF?text=Product+Image"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Image Overlay with Quick Actions */}
            <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <button 
                onClick={handleAddToWishlist}
                className="w-10 h-10 rounded-full bg-dark/80 border border-white/10 flex items-center justify-center text-white hover:bg-neon-pink hover:border-neon-pink transition-all duration-300"
                title="Add to Wishlist"
              >
                <Heart size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-neon-cyan text-dark flex items-center justify-center shadow-neon-cyan">
                <Eye size={18} />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="px-3 py-1 bg-neon-cyan text-dark text-[10px] font-black uppercase tracking-widest rounded-sm shadow-neon-cyan">
                  New
                </span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 bg-neon-pink text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                  -{discountPercentage}%
                </span>
              )}
              {product.isLimitedEdition && (
                <span className="px-3 py-1 bg-neon-purple text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/20">
                  Limited
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan/80">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{product.averageRating}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Price Area */}
            <div className="flex items-end gap-3 mb-6">
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-xs text-gray-500 line-through decoration-neon-pink">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-black text-white font-heading">
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
              </div>
              
              {/* Stock Status Indicator */}
              <div className="mb-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  product.stockStatus === 'In Stock' ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-neon-pink border-neon-pink/20 bg-neon-pink/5"
                )}>
                  {product.stockStatus}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'Out of Stock'}
                className="flex-grow btn-solid !py-2.5 !text-[11px] group/btn flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                ADD TO CART
              </button>
              
              {/* Quick Info Feature Icon */}
              <div className="w-10 h-10 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center text-text-secondary" title="Speed Surface">
                <Zap size={16} />
              </div>
            </div>
          </div>

          {/* Bottom Interactive Line */}
          <div className="h-1 w-0 bg-neon-cyan group-hover:w-full transition-all duration-500"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;