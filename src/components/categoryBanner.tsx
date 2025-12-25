"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlainCategoryType } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoriesBanner({
  categories,
}: {
  categories: PlainCategoryType[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  console.log(defaultCategory)

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

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", value);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Filters and Sorting Section */}
      <div className="flex md:flex-row items-center justify-between w-full mb-8 gap-4  bg-gray-100">
        <Carousel className="flex overflow-x-auto overflow-y-hidden scrollbar-hide">
          <CarouselContent className="-ml-1 flex">
            <CarouselItem className="pl-1 flex-none w-auto">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-2 py-4 text-[1rem] font-bold transition-colors duration-200 ${selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-800 hover:bg-gray-300"
                  }`}
              >
                All Products
              </button>
            </CarouselItem>
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-1 flex-none w-auto">
                <button
                  onClick={() => handleCategoryChange(category.name)}
                  className={`px-2 py-4 text-[1rem] font-bold transition-colors duration-200 ${selectedCategory === category.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-800 hover:bg-gray-300"
                    }`}
                >
                  {category.name}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* Sort Dropdown  */}
        {/* <div className="flex items-center md:ml-auto">
          <Select onValueChange={(e) => handleSortChange(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Prices</SelectLabel>
                <SelectItem value="price-asc">Low to High</SelectItem>
                <SelectItem value="price-desc">High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
}
