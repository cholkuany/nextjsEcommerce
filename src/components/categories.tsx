"use client";

import { ProductType } from "@/types";

import { useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { useMemo, useState, useEffect, useCallback, MouseEvent } from "react";

/**
 * Props
 *  products  : Full product list (used to derive unique categories)
 *  onSelect? : Optional cb fired when a category is clicked
 */
export default function DepartmentCarousel({
  products,
  onSelect,
}: {
  products: ProductType[];
  onSelect?: (categoryName: string) => void;
}) {
  /* ------------------------------------------------------------------ */
  /* 1. Build a UNIQUE, COUNTED category list from the products array   */
  /* ------------------------------------------------------------------ */
  const categories = useMemo(
    () =>
      Array.from(
        products
          .reduce((map, p) => {
            const name = p.category.name;
            const current = map.get(name);
            map.set(name, {
              /* keep the first image we see for the avatar */
              image: current?.image || p.images[0],
              /* accumulate product count */
              count: (current?.count || 0) + 1,
              name,
            });
            return map;
          }, new Map<string, { image: string; count: number; name: string }>())
          .values()
      ),
    [products]
  );

  /* ------------------------------------------------------------------ */
  /* 2. Horizontal scrolling helpers                                    */
  /* ------------------------------------------------------------------ */
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const SCROLL_STEP = 320; // px
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const doScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  /* ------------------------------------------------------------------ */
  /* 3. Click-drag support (desktop)                                    */
  /* ------------------------------------------------------------------ */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onDragStart = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
  };
  const onDragMove = (e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - walk;
  };
  const endDrag = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  /* ------------------------------------------------------------------ */
  /* 4. Render                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <section className="w-full mx-auto mb-16">
      <header className="mb-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Shop by Department
        </h2>
        <p className="text-center text-gray-600">
          Swipe, scroll or click to pick a category.
        </p>
      </header>

      {/* Arrow buttons */}
      <div className="relative">
        {/* left */}
        <button
          aria-label="Scroll departments left"
          onClick={() => doScroll("left")}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-md bg-white transition
            ${canScrollLeft
              ? "hover:bg-gray-100"
              : "opacity-0 pointer-events-none"
            }
          `}
        >
          <FaChevronLeft size={22} />
        </button>

        {/* scroll container */}
        <div
          ref={scrollRef}
          /* keyboard nav */
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") doScroll("left");
            if (e.key === "ArrowRight") doScroll("right");
          }}
          /* drag to scroll */
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          /* styling */
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar cursor-grab
                     py-2 px-1 scroll-pt-1
                     snap-x snap-mandatory"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect?.(cat.name)}
              className="shrink-0 flex flex-col items-center snap-start w-32 focus:outline-none"
            >
              {/* avatar */}
              <div className="relative h-28 w-28">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  loading="lazy"
                  className="rounded-full object-cover"
                />
                {/* product count badge */}
                <span className="absolute bottom-1 right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-white shadow text-gray-700 font-semibold">
                  {cat.count}
                </span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-800 capitalize">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* right */}
        <button
          aria-label="Scroll departments right"
          onClick={() => doScroll("right")}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-md bg-white transition
            ${canScrollRight
              ? "hover:bg-gray-100"
              : "opacity-0 pointer-events-none"
            }
          `}
        >
          <FaChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
