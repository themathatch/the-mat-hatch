import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Link } from 'react-router-dom';


const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getCartSubtotal,
    getShippingCost,
    getCartTotal,
    getTotalItems
  } = useCartStore();

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const total = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[200]"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-white/5 z-[210] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="text-neon-cyan" size={24} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon-cyan text-dark text-[10px] font-black flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
              </div>
              <button 
                onClick={() => toggleCart(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Cart is Empty</h3>
                  <p className="text-gray-500 text-sm mb-8">Your desk mat haven is waiting for its first item.</p>
                  <button 
                    onClick={() => toggleCart(false)}
                    className="btn-primary px-8 py-3 text-xs"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selectedVariantId}`} className="flex gap-4 group">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/5 flex-shrink-0">
                      <img 
                        src={item.images.find(img => img.isMain)?.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-white uppercase line-clamp-1 group-hover:text-neon-cyan transition-colors">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.id, item.selectedVariantId)}
                          className="text-gray-600 hover:text-neon-pink transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                        {item.category} | XL 900x400mm
                      </p>

                      <div className="flex justify-between items-center">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-dark/60 rounded-lg p-1 border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedVariantId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-white hover:bg-neon-cyan hover:text-dark transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedVariantId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-white hover:bg-neon-cyan hover:text-dark transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-black text-neon-cyan">
                          ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-dark/60 border-t border-white/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-bold">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      Shipping <Truck size={14} className="text-neon-purple" />
                    </span>
                    <span className="text-white font-bold">
                      {shipping === 0 ? <span className="text-green-500">FREE</span> : `৳${shipping}`}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t border-white/5">
                    <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                    <span className="text-2xl font-black text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link 
                  to="/checkout" 
                  onClick={() => toggleCart(false)}
                  className="w-full btn-solid flex items-center justify-center gap-3 py-4 shadow-neon-cyan/20 group"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <ShieldCheck size={14} className="text-neon-cyan" />
                  Secure SSL Encrypted Checkout
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;