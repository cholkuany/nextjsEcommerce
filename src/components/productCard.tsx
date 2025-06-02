"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCart from "@/components/addToCart";
import { ProductType } from "@/types";

export default function ProductCard({ product }: { product: ProductType }) {
  return (
    <Link
      href={`product/${product.id}`}
      className="group relative size-40 lg:size-80 hover:scale-105 transition duration-300 ease-in-out shadow rounded-md"
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        sizes="(min-width: 640px) 200px, 100vw"
        className="rounded-lg object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-transparent bg-opacity-60 text-white p-2 flex items-end justify-between text-sm sm:text-xs">
        <span className="font-semibold text-black">
          ${product.price.toFixed(2)}
        </span>
        <AddToCart product={product} />
      </div>
    </Link>
  );
}
