"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "./productCard";

import { PlainCategoryType } from "@/app/lib/data";
import { ProductType } from "@/types";

export default function ProductGallery({
  products,
  categories,
}: {
  products: ProductType[];
  categories: PlainCategoryType[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  useEffect(() => {
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", value);
    }
    router.push(`?${newParams.toString()}`);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category.name === selectedCategory);

  return (
    <div className="flex flex-col items-start">
      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="category" className="mr-2 font-semibold">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="w-full flex flex-wrap items-center justify-center gap-4 mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="h-[35vh] flex items-center justify-center">
            <p className="col-span-full text-center text-3xl md:text-5xl text-gray-700">
              No products found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
