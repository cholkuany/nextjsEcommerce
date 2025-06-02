"use client";

import { useState } from "react";

import { ProductType } from "@/types";
import { useCart } from "@/app/providers/cartContext/context";
import ProductCard from "@/components/productCard";

import clsx from "clsx";

import Image from "next/image";
import Link from "next/link";

export default function ProductDetails({
  product,
  relatedProducts = [],
}: {
  product: ProductType;
  relatedProducts?: ProductType[];
}) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const { addToCart } = useCart();

  return (
    <section className="max-w-7xl min-h-screen mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Images */}
      <div className="relative w-full md:w-auto md:max-w-xl">
        {/* Main product image */}
        <Image
          src={selectedImage}
          alt={product.name}
          width={500}
          height={500}
          className="object-cover rounded-lg"
          priority
        />
        {/* Thumbnail images (if multiple) */}
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <div
                key={i}
                className={clsx("relative w-20 h-20 rounded overflow-hidden", {
                  "border border-blue-700": selectedImage === img,
                })}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i}`}
                  width={80}
                  height={80}
                  className="object-cover"
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col gap-4 font-extrabold">
        <h1 className="text-4xl font-semibold">{product.name}</h1>{" "}
        {/* Increased heading size */}
        <p className="text-2xl font-bold text-green-600">
          ${product.price.toFixed(2)}
        </p>{" "}
        {/* Increased price size */}
        <p className="text-gray-600 text-lg">{product.description}</p>{" "}
        <div className="flex gap-4 mt-4">
          <button
            disabled={product.inStock === 0}
            className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 transition disabled:bg-gray-400 w-full md:w-auto"
            onClick={() => {
              if (product.inStock > 0) {
                addToCart({
                  _id: product.id,
                  name: product.name,
                  price: product.price,
                  images: product.images,
                  description: product.description,
                });
              }
            }}
          >
            {product.inStock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
          {/* Added Use Client button */}
        </div>
        <div className="text-gray-600 text-sm mt-4">
          {" "}
          {/* Added metadata section */}
          <p>
            <strong>Category:</strong> {product.category.name}
          </p>
          <p>
            <strong>Stock:</strong>{" "}
            {product.inStock > 0
              ? `${product.inStock} available`
              : "Out of Stock"}
          </p>
        </div>
        <Link
          href="/"
          className="underline text-gray-500 hover:text-green-600 mt-4"
        >
          Back to Shop
        </Link>
      </div>

      {/* related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-row flex-wrap gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
