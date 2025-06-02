"use client";

import { GiShoppingCart } from "react-icons/gi";
import { useCart } from "@/app/providers/cartContext/context";
import { CartItem } from "@/types";
import { ProductType } from "@/types";

// type AddToCartProps = {
//   product: {
//     id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images: string[];
//     description: string;
//   };
// };

export default function AddToCart({ product }: { product: ProductType }) {
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    quantity: 1,
  };

  const { addToCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(cartItem);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(cartItem);
      }}
      className="flex justify-center items-center hover:text-green-300 transition-colors z-20 w-7 h-7 text-white bg-black rounded-full p-1"
      title="Add to Cart"
    >
      <GiShoppingCart className="text-lg sm:text-base w-full h-full" />
    </button>
  );
}
