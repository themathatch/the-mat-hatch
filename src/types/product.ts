export type Category = 'Gaming' | 'Office' | 'Anime' | 'Minimal' | 'RGB' | 'Custom';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-Order';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "900x400mm", "Speed Surface"
  additionalPrice: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string; // Cloudinary URL
  isMain: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  category: Category;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  features: string[]; // e.g., ["Stitched Edges", "Non-slip Base"]
  stockStatus: StockStatus;
  totalStock: number;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;

isBestSeller: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  selectedVariantId: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}