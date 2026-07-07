import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  
  Loader2,
  
  ChevronLeft,
  ChevronRight
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleCategoryChange = (category: Category | 'All') => {
    setActiveCategory(category);
    filterByCategory(category);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UPDATED CATEGORY LIST
  const categories: (Category | 'All')[] = ['All', 'Gaming', 'Nature', 'Anime', 'Movie', 'Other'];

  return (
    <>
      <Helmet>
        <title>All Collections | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6">
        <div className="container mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                THE <span className="text-transparent bg-clip-text bg-purple-gradient">ARMORY</span>
              </h1>
              <p className="text-gray-500 font-heading tracking-[0.2em] uppercase text-xs mt-2">
                Deploying {filteredProducts.length} Tactical Units
              </p>
            </motion.div>

            <div className="w-full max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text" value={searchQuery} onChange={handleSearch}
                placeholder="Search assets..."
                className="w-full bg-[#130C25]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-neon-cyan outline-none transition-all"
              />
            </div>
          </div>

          <div className="glass-panel p-4 mb-12 border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full lg:w-auto">
              <div className="hidden lg:flex items-center gap-2 mr-4 text-neon-cyan px-3 border-r border-white/10">
                <Filter size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Sector</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat} onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                    activeCategory === cat ? "bg-neon-cyan text-dark border-neon-cyan shadow-neon-cyan" : "bg-white/5 text-gray-400 border-transparent hover:border-white/20 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-56 group">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple" size={16} />
              <select 
                onChange={(e) => sortProducts(e.target.value as any)}
                className="w-full bg-dark/50 border border-white/5 rounded-xl py-3 pl-11 pr-10 text-[10px] font-black uppercase text-gray-300 appearance-none outline-none focus:border-neon-purple cursor-pointer"
              >
                <option value="newest">Latest Drop</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
              <p className="text-gray-500 uppercase tracking-[0.4em] font-heading text-xs">Syncing Armory...</p>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode='popLayout'>
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-32 glass-panel border-dashed border-white/10">
              <h3 className="text-2xl font-black uppercase text-white mb-4">No Gear Detected</h3>
              <button onClick={() => { clearFilters(); setActiveCategory('All'); setSearchQuery(''); }} className="btn-primary px-10">RESET ALL PROTOCOLS</button>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all"><ChevronLeft size={20} /></button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} className={cn("w-12 h-12 rounded-xl font-black text-xs transition-all border", currentPage === i + 1 ? "bg-neon-cyan text-dark border-neon-cyan shadow-neon-cyan" : "bg-white/5 text-gray-500 border-white/5")}>{String(i + 1).padStart(2, '0')}</button>
                ))}
              </div>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;