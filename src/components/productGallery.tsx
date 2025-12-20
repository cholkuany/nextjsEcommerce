"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TProduct } from "@/types";
import ProductCard from "./productCard";

export default function ProductGallery({
  products,
}: {
  products: TProduct[];
}) {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const query = searchParams.get("query");
  const sort = searchParams.get("sort");

  console.log(products[0].categoryPath)
  console.log(products[0].categoryName)
  /**
   * 🔹 Main filtered list (for the grid)
   */
  const filteredProducts = useMemo(() => {
    let result = products;
    if (category) {
      result = result.filter(
        (p) => p.categoryPath === category
      );
    }

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.categoryPath?.toLowerCase().includes(q)
      );
    }

    // Only copy if sorting (because sort mutates)
    if (sort) {
      result = [...result].sort((a, b) => {
        switch (sort) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [products, category, query, sort]);

  /**
   * 🔹 Home page sections (GLOBAL, not filtered)
   */
  const onSales = useMemo(
    () => products.filter((p) => p.discount?.isActive),
    [products]
  );

  const bestsellers = useMemo(
    () => products.filter((p) => p.isBestseller),
    [products]
  );

  return (
    <div className="flex flex-col gap-20 w-full">

      {/* 🟦 MAIN GRID (filtered) */}
      <Section title={category ? category : "All products"} products={filteredProducts} />
      {/* 🟢 HOME PAGE HIGHLIGHTS */}
      {onSales.length > 0 && (
        <Section title="On sales" products={onSales} />
      )}

      {bestsellers.length > 0 && (
        <Section title="Popular products" products={bestsellers} />
      )}

    </div>
  );
}

export function Section({
  title,
  products,
}: {
  title: string;
  products: TProduct[];
}) {
  return (
    <section className="w-full mt-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-left mb-8">
        {title}
      </h2>

      {products.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-left text-xl text-gray-500">
          No products found.
        </p>
      )}
    </section>
  );
}

