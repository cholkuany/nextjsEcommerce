"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, DownloadCloud } from "lucide-react";

import AddToCart from "@/components/addToCart";
import type { TProduct } from "@/types";
import { getStars } from "./star";
import { getDiscountedPrice } from "@/app/lib/utils";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: TProduct }) {
  const { finalPrice, discountPercent } = getDiscountedPrice(
    product.price,
    product.discount
  );

  const ratingValue = product.reviews?.averageRating ?? 0;
  const ratingCount = product.reviews?.totalReviews ?? 0;
  // md:flex md:flex-col
  return (
    <Card className="group grid grid-cols-1 duration-200 overflow-hidden w-[240px] md:max-w-[250px] h-[550px] bg-white">
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

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 bg-white rounded-full shadow hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Add to Wishlist"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </Button>

        {/* Sale Badge */}
        {product.discount?.isActive && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-sm z-10">
            {discountPercent}% OFF
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
        <p className="font-bold line-clamp-3 tracking-tighter">
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

        {/* Add to Cart */}
        <div className="mt-auto">
          <AddToCart product={product} />
        </div>
      </CardContent>
    </Card>
  );
}
