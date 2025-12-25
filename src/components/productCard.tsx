"use client";

import Image from "next/image";
import Link from "next/link";
import { DownloadCloud } from "lucide-react";

import AddToCart from "@/components/addToCart";
import type { TProduct } from "@/types";
import { getStars } from "./star";
import { getDiscountedPrice } from "@/app/lib/utils";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }: { product: TProduct }) {
  const { finalPrice, discountPercent } = getDiscountedPrice(
    product.price,
    product.discount
  );

  const ratingValue = product.reviews?.averageRating ?? 0;
  const ratingCount = product.reviews?.totalReviews ?? 0;
  // md:flex md:flex-col
  return (
    <Card className="relative group grid grid-cols-1 duration-200 overflow-hidden w-28 md:w-48 bg-white">
      {/* ---------- Image Section ---------- */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-gray-50"
      >
        <Image
          src={product.baseImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Sale Badge */}
        {product.discount?.isActive && (
          <Badge className="absolute top-2 left-1 bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-sm z-10">
            {discountPercent}% off
          </Badge>
        )}

        {/* Digital Download Icon */}
        {product.isDigital && (
          <span className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow">
            <DownloadCloud className="w-4 h-4 text-sky-600" />
          </span>
        )}
      </Link>
      {/* ---------- Content Section ---------- */}
      <CardContent className="flex flex-col gap-1.5 p-3 pb-4">
        {/* Category (optional) */}
        <span className="text-[11px] text-gray-500 truncate">
          {product.categoryName}
        </span>

        {/* Product Name */}
        <Link
          href={`/product/${product.slug}`}
          className="text-[14px] font-semibold text-gray-900 leading-tight hover:text-blue-600 line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="font-bold line-clamp-2 md:line-clamp-3 tracking-tighter">
          {product.shortDescription}
        </p>

        {/* Ratings */}
        {5 > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            {getStars(ratingValue)}
            <span className="text-[12px] text-gray-500">({ratingCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-1">
          {product.discount?.isActive ? (
            <div className="flex gap-0.5">
              <span className="text-sm font-bold text-red-600">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-[12px] text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      {/* Add to Cart */}
      <div className="absolute top-0 right-0 mt-auto">
        <AddToCart product={product} />
      </div>
    </Card>
  );
}