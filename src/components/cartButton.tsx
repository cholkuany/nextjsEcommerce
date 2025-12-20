"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/providers/cartContext/context";

export function CartButton() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative hover:text-blue-400">
      <ShoppingBag size={24} className="text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
