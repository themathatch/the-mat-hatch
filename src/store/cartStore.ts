import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';

// Utility for Facebook Pixel Tracking
const trackAddToCart = (product: Product) => {
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'AddToCart', {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: product.discountPrice || product.price,
      currency: 'BDT'
    });
  }
};

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  
  // Actions
  addItem: (product: Product, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  applyCoupon: (code: string) => boolean;
  
  // Computed values
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getTaxAmount: () => number;
  getShippingCost: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      couponCode: null,
      discountAmount: 0,

      addItem: (product, variantId = 'default') => {
        const { items } = get();
        
        // Track the event to Meta Pixel
        trackAddToCart(product);

        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedVariantId === variantId
        );

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.id === product.id && item.selectedVariantId === variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            ...product,
            selectedVariantId: variantId,
            quantity: 1,
          };
          set({ items: [...items, newItem] });
        }
        set({ isCartOpen: true });
      },

      removeItem: (productId, variantId = 'default') => {
        const { items } = get();
        const updatedItems = items.filter(
          (item) => !(item.id === productId && item.selectedVariantId === variantId)
        );
        set({ items: updatedItems });
      },

      updateQuantity: (productId, variantId, quantity) => {
        const { items } = get();
        if (quantity < 1) return;

        const updatedItems = items.map((item) =>
          item.id === productId && item.selectedVariantId === variantId
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      toggleCart: (isOpen) => 
        set((state) => ({ isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen })),

      applyCoupon: (code) => {
        if (code.toUpperCase() === 'FIRSTMAT20') {
          const subtotal = get().getCartSubtotal();
          set({ couponCode: code, discountAmount: subtotal * 0.2 });
          return true;
        }
        return false;
      },

      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.discountPrice || item.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getTaxAmount: () => {
        return 0; // Tax removed
      },

      getShippingCost: () => {
        const items = get().items;
        // If cart is empty, shipping is 0. Otherwise default is 80 (Inside Dhaka)
        return items.length > 0 ? 80 : 0; 
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().discountAmount;
        // Add shipping cost to the total immediately
        return subtotal + shipping - discount;
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'the-mat-hatch-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);