"use client";

import { ProductsByCategory, ProductType } from "@/types";
import ProductCard from "./productCard";

import { useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function DepartmentCarousel({
  products,
}: {
  products: ProductType[];
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: string) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = 300;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col w-full mx-auto mb-16">
      <h1 className="text-2xl font-bold mb-4">Shop by Department</h1>
      <p className="mb-6">
        Explore our collection of products. Use the filter to narrow down your
        search.
      </p>

      {/* Arrows */}
      <div className="relative w-full">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <FaChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar whitespace-nowrap space-x-2 pb-2 scroll-smooth"
        >
          {/* Slides */}
          {products.map((product) => {
            return (
              <div
                key={product.slug}
                className="relative inline-block h-40 w-44 align-top"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-28 h-28 mb-2 rounded-full"
                />
                <div className="absolute inset-0 w-28 h-28 bg-blue-500/10 rounded-full"></div>
                <p className="text-md font-light">{product.category.name}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 mt-20">On sale in your area</h1>
      {/* Arrows */}
      <div className="relative w-full">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <FaChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="w-full flex flex-wrap items-center justify-center gap-4 mx-auto"
        >
          {/* Slides */}
          {products.map((product) => {
            return (
              // <div
              //   key={product.slug}
              //   className="relative inline-block h-40 w-44 align-top"
              // >
              //   <Image
              //     src={product.images[0]}
              //     alt={product.name}
              //     width={400}
              //     height={400}
              //     className="object-cover w-28 h-28 mb-2"
              //   />
              // </div>
              <ProductCard key={product.slug} product={product} />
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
