"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { TProduct } from "@/types";
import { IProductImage, IVariantCombination } from "@/models/modelTypes/product";
import { useCart } from "@/app/providers/cartContext/context";
import { getDiscountedPrice } from "@/app/lib/utils";
import { Pricing } from "@/components/pricing";
import { ShoppingBag } from "lucide-react";

export default function ProductDetails({ product }: { product: TProduct }) {
  console.log("Product Details:", product)
  // Start with default variant (first active variant)
  const defaultVariant: IVariantCombination = useMemo(
    () => product.variants.find(v => v?.isDefault) || product.variants[0],
    [product.variants]
  );

  const [selectedVariant, setSelectedVariant] = useState<IVariantCombination>(defaultVariant);
  const [selectedImage, setSelectedImage] = useState<IProductImage>(selectedVariant.images[0]);

  const { addToCart } = useCart();

  const { finalPrice, discountPercent } = getDiscountedPrice(
    selectedVariant.price,
    product.discount
  );

  // Handle variant selection
  const handleVariantChange = (optionName: string, optionValue: string) => {
    const newVariant = product.variants.find(v =>
      v.options.every(vo =>
        vo.name === optionName ? vo.value === optionValue : true
      )
    );
    if (newVariant) {
      setSelectedVariant(newVariant);
      setSelectedImage(newVariant.images[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Images */}
      <div className="relative w-full md:w-auto md:max-w-xl">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          width={500}
          height={500}
          className="object-cover rounded-lg"
          priority
        />
        {/* Thumbnail images */}
        {selectedVariant.images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {selectedVariant.images.map((img, i) => (
              <div
                key={i}
                className={clsx("relative w-20 h-20 rounded overflow-hidden", {
                  "border border-blue-700": selectedImage === img,
                })}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
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
      <div className="flex flex-col gap-4">
        <h3 className="text-xl md:text-4xl font-semibold">{product.name}</h3>

        <Pricing
          currentPrice={selectedVariant.price}
          price={finalPrice}
          isDiscounted={product.discount?.isActive ?? false}
          discountPercent={discountPercent}
        />

        <p className="text-gray-600 text-md/8">{product.description}</p>

        {/* Variant Selection */}
        {product.variantDefinitions?.map(def => (
          <div key={def.name} className="mt-4">
            <p className="text-sm font-medium text-gray-700">{def.name}:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {def.values.map(value => {
                const isSelected = selectedVariant.options.some(
                  o => o.name === def.name && o.value === value
                );
                return (
                  <button
                    key={value}
                    className={clsx(
                      "px-3 py-1 rounded border",
                      isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300"
                    )}
                    onClick={() => handleVariantChange(def.name, value)}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add to Cart */}
        <div className="flex gap-4 mt-4">
          <button
            disabled={selectedVariant.stock === 0}
            className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 transition disabled:bg-gray-400 w-full md:w-auto"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                baseImage: product.baseImage,
                description: product.description,
                quantity: 1,
                variantSku: selectedVariant.sku,
                variantOptions: selectedVariant.options,
                variantPrice: selectedVariant.price,
                variantImages: selectedVariant.images,
              })
            }
          >
            {selectedVariant.stock > 0 ? (
              <div className="flex flex-row items-center gap-4">
                <ShoppingBag />
                <p>Add to Cart</p>
              </div>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>

        {/* Metadata */}
        <div className="text-gray-600 text-sm mt-4">
          <p><strong>Category:</strong> {product.categoryPath}</p>
          <p>
            <strong>Stock:</strong>{" "}
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : "Out of Stock"}
          </p>
        </div>

        <Link
          href="/"
          className="underline text-gray-500 hover:text-green-600 mt-4"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

