import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/product/ProductCard';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';

const Shop: React.FC = () => {
  const { 
    filteredProducts, 
    loading, 
    fetchProducts, 
    searchProducts, 
    filterByCategory, 
    sortProducts,
    clearFilters
  } = useProductStore();

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleCategoryChange = (category: Category | 'All') => {
    setActiveCategory(category);
    filterByCategory(category);
  };

  const categories: (Category | 'All')[] = ['All', 'Gaming', 'Office', 'Anime', 'Minimal', 'RGB', 'Custom'];

  return (
    <>
      <Helmet>
        <title>All Collections | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6">
        <div className="container mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                THE <span className="text-transparent bg-clip-text bg-purple-gradient">ARMORY</span>
              </h1>
              <p className="text-gray-500 font-heading tracking-[0.2em] uppercase text-xs mt-2">
                Deploying {filteredProducts.length} Tactical Mousepads
              </p>
            </motion.div>

            <div className="w-full max-w-md relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search your aesthetic..."
                className="w-full bg-[#130C25]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all placeholder:text-gray-600"
              />
              {searchQuery && (
                <button 
                  onClick={() => {setSearchQuery(''); searchProducts('');}}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="glass-panel p-4 mb-12 border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full lg:w-auto">
              {/* FIXED CSS CONFLICT HERE */}
              <div className="hidden lg:flex items-center gap-2 mr-4 text-neon-cyan px-3 border-r border-white/10">
                <Filter size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Sector</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                    activeCategory === cat 
                      ? "bg-neon-cyan text-dark border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "bg-white/5 text-gray-400 border-transparent hover:border-white/20 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-56 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neon-purple">
                <ArrowUpDown size={16} />
              </div>
              <select 
                onChange={(e) => sortProducts(e.target.value as any)}
                className="w-full bg-dark/50 border border-white/5 rounded-xl py-3 pl-11 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-300 appearance-none focus:outline-none focus:border-neon-purple transition-all cursor-pointer"
              >
                <option value="newest">Latest Drop</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Battle-Tested</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-600">
                <SlidersHorizontal size={14} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
              <p className="text-gray-500 uppercase tracking-[0.4em] font-heading text-xs">Syncing Satellite Data...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 glass-panel border-dashed border-white/10"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-700">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-4">No Tactical Match</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">No mousepads matched your current search parameters.</p>
              <button 
                onClick={() => {
                  clearFilters();
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary px-10"
              >
                CLEAR ALL PROTOCOLS
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;