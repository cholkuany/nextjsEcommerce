"use client";

import { useCart } from "@/app/providers/cartContext/context";
import { CartItem } from "@/types";
import { TProduct } from "@/types";
import { Plus } from "lucide-react";

export default function AddToCart({ product }: { product: TProduct }) {
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    baseImage: product.baseImage,
    description: product.description,
    quantity: 1,
    variantSku: product.variants[0].sku,
    variantOptions: product.variants[0].options,
    variantPrice: product.variants[0].price,
    variantImages: product.variants[0].images,
  };

  const { addToCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(cartItem);
  };

  return (
    // <button
    //   onClick={handleClick}
    //   className="flex justify-center items-center hover:text-green-300 transition-colors z-20 text-white bg-blue-700 rounded-full p-1 w-full"
    //   title="Add to Cart"
    // >
    //   <Plus className="ml-2 h-4 w-4" />
    // </button>
    <button
      onClick={handleClick}
      className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white hover:bg-blue-600 transition"
      title="Add to Cart"
    >
      <Plus className="h-4 w-4" />
    </button>

  );
}
