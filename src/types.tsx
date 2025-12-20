import { IProduct, IProductImage, IVariantOption } from "@/models/modelTypes/product";

export type Session = {
  user: User
  expires: string
} | null

export type Cat = {
  id: string;
  url: string;
  height: number;
  width: number;
};

export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: RoleType;
}

export type RoleType = "user" | "admin" | undefined;

export type ImageDetailsProps = {
  url: string;
  height: number;
  width: number;
};

export type FormState = {
  error?: {
    name?: string[];
    slug?: string[];
    price?: string[];
    description?: string[];
    inStock?: string[];
    category?: string;
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
  "image/avif",
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
    image?: string;
  };
};
export type PlainCategoryType = {
  id: string;
  name: string;
  slug: string;
  image?: string;
};

export type TProduct = IProduct<string> & {
  id: string;
};

export type TCategory = {
  _id: string;
  products: TProduct[];
};

export type LeanUser = {
  name: string;
  email: string;
  image: string;
  role: string;
};

export type CartItem = Pick<
  TProduct,
  "id" | "name" | "price" | "baseImage" | "description"
> & {
  quantity: number;
  variantSku: string;
  variantOptions: IVariantOption[];
  variantPrice: number;
  variantImages: IProductImage[];
};



export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  deleteProductFromCart: (productId: string) => void;
  clearCart: () => void;
};

export type StripeProduct = {
  name: string;
  price: number;
  description: string;
  quantity: number;
  images?: string[];
  sku: string;
};