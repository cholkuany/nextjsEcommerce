import { ProductDocument } from "@/models/product";
import { CategoryDocument } from "@/models/category";
import { Types } from "mongoose";

export type Cat = {
  id: string;
  url: string;
  height: number;
  width: number;
};

export type ImageDetailsProps = {
  url: string;
  height: number;
  width: number;
};

// The `category` is now the full Category object instead of just ObjectId
export type PopulatedProduct = ProductDocument & {
  category: CategoryDocument;
};

export type FormState = {
  error?: {
    name?: string[];
    slug?: string[];
    price?: string[];
    description?: string[];
    inStock?: string[];
    category?: string;
    // images?: string[];
    images?: File[];
  };
  message: string | null;
};
export type ImageStateSchema = {
  error?: {
    images?: string[];
  };
  message: string | null;
};

export const ALLOWED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/heic",
];
export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes

export type ProductsByCategory = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  inStock: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  // categoryName: "$categoryInfo.name",
  // categorySlug: "$categoryInfo.slug",
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  inStock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type LeanCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
};

export type CartItem = Pick<
  ProductType,
  "id" | "name" | "price" | "images" | "description"
> & {
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  deleteProductFromCart: (productId: string) => void;
};

export type StripeProduct = {
  name: string;
  price: number;
  description: string;
  quantity: number;
  images?: string[];
};
