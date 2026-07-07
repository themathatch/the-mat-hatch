import { create } from 'zustand';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { Product, Category } from '@/types/product';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  searchProducts: (query: string) => void;
  filterByCategory: (category: Category | 'All') => void;
  sortProducts: (type: 'price-low' | 'price-high' | 'newest' | 'rating' | 'manual') => void;
  clearFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  featuredProducts: [],
  loading: false,
  error: null,

  // Fetch all products with local sorting to prevent missing data
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      // We fetch by creation date first to ensure all products are retrieved
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Local Sorting: Items with sortOrder come first, others go to the end
      const sortedProducts = [...productsData].sort((a, b) => {
        const orderA = a.sortOrder !== undefined ? a.sortOrder : 999;
        const orderB = b.sortOrder !== undefined ? b.sortOrder : 999;
        return orderA - orderB;
      });
      
      set({ 
        products: sortedProducts, 
        filteredProducts: sortedProducts, 
        loading: false 
      });
    } catch (error: any) {
      console.error("Critical Sync Error:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Fetch featured products with local sorting
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'products'), 
        where('isFeatured', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const featured = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      const sortedFeatured = [...featured].sort((a, b) => {
        const orderA = a.sortOrder !== undefined ? a.sortOrder : 999;
        const orderB = b.sortOrder !== undefined ? b.sortOrder : 999;
        return orderA - orderB;
      });
      
      set({ featuredProducts: sortedFeatured, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  fetchProductBySlug: async (slug: string) => {
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Product;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  searchProducts: (searchQuery: string) => {
    const { products } = get();
    if (!searchQuery.trim()) {
      set({ filteredProducts: products });
      return;
    }
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    set({ filteredProducts: filtered });
  },

  filterByCategory: (category: Category | 'All') => {
    const { products } = get();
    if (category === 'All') {
      set({ filteredProducts: products });
    } else {
      const filtered = products.filter(p => p.category === category);
      set({ filteredProducts: filtered });
    }
  },

  sortProducts: (type) => {
    const { filteredProducts } = get();
    let sorted = [...filteredProducts];
    
    switch (type) {
      case 'manual':
        sorted.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
        break;
      case 'price-low':
        sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
    }
    set({ filteredProducts: sorted });
  },

  clearFilters: () => {
    const { products } = get();
    set({ filteredProducts: products });
  }
}));