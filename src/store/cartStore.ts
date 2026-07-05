import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';

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
  
  // Computed values (Getters)
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
        set({ isCartOpen: true }); // Open cart drawer when item is added
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
        // Sample Coupon Logic - In production, this would be an API call
        if (code.toUpperCase() === 'FIRSTMAT20') {
          const subtotal = get().getCartSubtotal();
          set({ couponCode: code, discountAmount: subtotal * 0.2 });
          return true;
        }
        return false;
      },

      // Calculations
      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.discountPrice || item.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getTaxAmount: () => {
        const subtotal = get().getCartSubtotal();
        return subtotal * 0.05; // Assuming 5% VAT
      },

      getShippingCost: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        const subtotal = get().getCartSubtotal();
        return subtotal > 5000 ? 0 : 60; // Free shipping above 5000 BDT
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const tax = get().getTaxAmount();
        const shipping = get().getShippingCost();
        const discount = get().discountAmount;
        return subtotal + tax + shipping - discount;
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'the-mat-hatch-cart', // Unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);