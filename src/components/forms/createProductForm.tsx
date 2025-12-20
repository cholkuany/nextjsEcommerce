"use client";

import Link from "next/link";
// import Image from "next/image";
// import clsx from "clsx";
import { useState, ChangeEvent, FormEvent } from "react";
import { createProductAction } from "../../app/actions/createAction";
import {
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { Trash2 } from 'lucide-react';

import Breadcrumbs from "@/components/breadcrumbs";
import { PlainCategoryType } from "@/types";
// import { ImagesSchema, FormDataSchema } from "@/zodSchemas/formSchema";
import { ALLOWED_IMAGE_TYPES, IMAGE_SIZE_LIMIT } from "@/types";
import {
  IVariantCombination,
  TDiscountType,
} from "@/models/modelTypes/product";
// import { z } from "zod";
// import {
//   checkboxToBoolean,
//   ImageSchema,
//   discountSchema,
// } from "@/zodSchemas/formSchema";

import Options from "./variants/options";

// const initialState = { errors: {}, message: "" };

// Define a type for a single variant for better state management
export interface ICreateVariant extends Omit<IVariantCombination, "images"> {
  id: string; // A unique client-side ID for mapping
  images: File[];
  previews: string[];
}

// import { TProduct } from "@/types";

function validateFiles(files: File[]): string | null {
  if (files.length === 0) return "At least one image required.";
  if (files.length > 3) return "Maximum 3 images allowed.";
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not allowed: ${file.type}`;
    }
    if (file.size > IMAGE_SIZE_LIMIT) {
      return `File ${file.name} exceeds 5MB limit.`;
    }
  }
  return null;
}

const variantInit = (): ICreateVariant => ({
  id: crypto.randomUUID(),
  sku: "",
  price: 0,
  stock: 0,
  options: [{ name: "", value: "" }],
  images: [],
  isDefault: false,
  isActive: true,
  lowStockThreshold: 10,
  trackQuantity: true,
  allowBackorder: false,

  previews: [],
})

export function CreateProductForm({
  categories,
}: {
  categories: PlainCategoryType[];
}) {
  const [variants, setVariants] = useState<ICreateVariant[]>([variantInit()]);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountType, setDiscountType] = useState<TDiscountType>("percentage");
  const [state, setState] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleVariantChange = <F extends keyof ICreateVariant>(
    variantId: string,
    field: F,
    value: ICreateVariant[F]
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const handleOptionChange = (
    variantId: string,
    optIndex: number,
    field: "name" | "value",
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
            ...v,
            options: v.options.map((opt, i) =>
              i === optIndex ? { ...opt, [field]: value } : opt
            ),
          }
          : v
      )
    );
  };

  const handleVariantImageDeletion = (variantId: string, imgId: number) => {
    setVariants((prev) => prev.map((v) => {
      if (v.id === variantId) {
        const newImages = v.images.filter((_, idx) => idx !== imgId);
        const newPreviews = v.previews.filter((_, idx) => {
          URL.revokeObjectURL(v.previews[imgId]);
          return idx !== imgId
        });
        return { ...v, images: newImages, previews: newPreviews };
      }
      return v;
    }));
  }

  const handleVariantImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files) return;

    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
            ...v,
            images: [...v.images, ...files],
            previews: [
              ...v.previews,
              ...files.map((file) => URL.createObjectURL(file)),
            ],
          }
          : v
      )
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev, variantInit()
    ]);
  };

  const removeVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const addVariantOption = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, options: [...v.options, { name: "", value: "" }] }
          : v
      )
    );
  };

  const removeVariantOption = (variantId: string, optIndex: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          return { ...v, options: v.options.filter((_, i) => i !== optIndex) };
        }
        return v;
      })
    );
  };

  // ---------- Submit ----------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const serverFormData = new FormData();

    // validate images for each variant
    for (let i = 0; i < variants.length; i++) {
      const error = validateFiles(variants[i].images);
      if (error) {
        setState(`Variant ${i + 1}: ${error}`);
        setIsPending(false);
        return;
      }
    }


    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      shortDescription: formData.get("shortDescription") as string,
      category: formData.get("category") as string,
      discount: discountEnabled,
      status: formData.get("status") as string,
      brandName: formData.get("brandName") as string,
      tags: formData.get("tags") as string,
      isNewArrival: formData.get("isNewArrival") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      isBestseller: formData.get("isBestseller") === "on",
    };

    serverFormData.append(
      "variants",
      JSON.stringify(
        variants.map((v, idx) => ({
          id: v.id,
          options: v.options,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          barcode: v.barcode,
          weight: v.weight,
          weightUnit: v.weightUnit,
          images: [],
          isDefault: idx === 0 || v.isDefault,
          isActive: v.isActive,
          lowStockThreshold: v.lowStockThreshold,
          trackQuantity: v.trackQuantity,
          allowBackorder: v.allowBackorder,
          preorderDate: v.preorderDate,
          discontinuedDate: v.discontinuedDate,
          restockDate: v.restockDate,
          isPreorder: v.isPreorder,
          availableFrom: v.availableFrom,
        }))
      )
    );

    serverFormData.append("name", data.name);
    serverFormData.append("slug", data.slug);
    serverFormData.append("description", data.description);
    serverFormData.append("shortDescription", data.shortDescription);
    serverFormData.append("category", data.category);
    serverFormData.append("status", data.status);
    serverFormData.append("brandName", data.brandName);
    serverFormData.append("tags", data.tags);
    serverFormData.append("isNewArrival", String(data.isNewArrival));
    serverFormData.append("isFeatured", String(data.isFeatured));
    serverFormData.append("isBestseller", String(data.isBestseller));

    variants.forEach((variant) => {
      variant.images.forEach((file) => {
        serverFormData.append(`variantImages[${variant.id}]`, file);
      });
    });

    const discount: {
      isActive: boolean;
      type: TDiscountType;
      value: number;
      startDate?: string;
      endDate?: string;
      maxDiscountAmount?: number;
    } = { isActive: false, type: "percentage", value: 0 };

    if (formData.get("discount[isActive]") === "on") {
      if (formData.get("discount[type]") === "percentage") {
        discount.maxDiscountAmount = parseFloat(
          formData.get("discount[maxDiscountAmount]") as string
        );
      }

      discount.isActive = true;
      discount.type = formData.get("discount[type]") as TDiscountType;
      discount.value = parseFloat(formData.get("discount[value]") as string);
      discount.startDate = new Date(
        formData.get("discount[startDate]") as string
      ).toISOString();
      discount.endDate = new Date(
        formData.get("discount[endDate]") as string
      ).toISOString();

      serverFormData.append("discount", JSON.stringify(discount));
    }

    const res = await createProductAction(serverFormData);
    console.log(res);

    // // 1. Validate JSON fields
    // const result = FSchema.safeParse(formData);
    // if (!result.success) {
    //   setState(JSON.stringify(result.error.flatten().fieldErrors));
    //   setIsPending(false);
    //   return;
    // }

    // // 2. Validate files for each variant
    // variants.forEach((variant, idx) => {
    //   const error = validateFiles(variant.images);
    //   if (error) {
    //     setState(`Variant ${Number(idx) + 1}: ${error}`);
    //     setIsPending(false);
    //     return;
    //   }
    // });

    // // 3. Build FormData
    // const fd = new FormData();
    // fd.append("name", result.data.name);
    // fd.append("slug", result.data.slug);
    // fd.append("description", result.data.description);
    // fd.append("category", result.data.category);
    // fd.append("variants", JSON.stringify(result.data.variants));

    // variants.forEach((variant, idx) => {
    //   variant.images.forEach((file) => {
    //     fd.append(`variantImages[${idx}]`, file);
    //   });
    // });

    // console.log("FINAL FORM DATA>>>", fd);

    // 4. Call server action
    // const res = await createProductAction(fd);

    // if (res?.message === "success") {
    //   setState("✅ Product created successfully!");
    // } else {
    //   setState("❌ Error: " + res?.message);
    // }

    setIsPending(false);
  };

  const requiredRedAsterisk = <span className="text-red-500">*</span>;
  // A common class string for text inputs, selects, and textareas for consistency
  const inputClasses =
    "block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Products", href: "/admin/products" },
            { label: "Create", href: "/admin/products/create", active: true },
          ]}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="p-6 bg-white rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="mb-4">
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name {requiredRedAsterisk}
                  </label>
                  <input
                    id="productName"
                    name="name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label
                    htmlFor="productSlug"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Slug {requiredRedAsterisk}
                  </label>
                  <input
                    id="productSlug"
                    name="slug"
                    className={inputClasses}
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="productDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="productDescription"
                    name="description"
                    rows={5}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shortDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Short Description
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    rows={2}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Variants & Inventory */}
            <div className="p-6 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Variants & Inventory
                </h3>
              </div>

              {/* Multi-Variant Management */}
              <div className="space-y-6">
                {variants.map((variant, v_idx) => (
                  <div
                    key={variant.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4 relative"
                  >
                    <h4 className="font-semibold text-md">
                      Variant {v_idx + 1}
                    </h4>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}

                    {/* Variant Options */}
                    <Options
                      variantId={variant.id}
                      v_idx={v_idx}
                      handleOptionChange={handleOptionChange}
                      addVariantOption={addVariantOption}
                      removeVariantOption={removeVariantOption}
                      inputClasses={inputClasses}
                      options={variant.options}
                    />

                    {/* Core fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price {requiredRedAsterisk}
                        </label>
                        <input
                          type="number"
                          name={`variants[${v_idx}][price]`}
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Compare At Price
                        </label>
                        <input
                          type="number"
                          name={`variants[${v_idx}][compareAtPrice]`}
                          value={variant.compareAtPrice || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "compareAtPrice",
                              parseFloat(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          SKU {requiredRedAsterisk}
                        </label>
                        <input
                          type="text"
                          name={`variants[${v_idx}][sku]`}
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "sku",
                              e.target.value
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                    </div>

                    {/* Inventory */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Stock {requiredRedAsterisk}
                        </label>
                        <input
                          type="number"
                          name={`variants[${v_idx}][stock]`}
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "stock",
                              parseInt(e.target.value, 10)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          name={`variants[${v_idx}][lowStockThreshold]`}
                          value={variant.lowStockThreshold || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "lowStockThreshold",
                              parseInt(e.target.value, 10)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <label className="text-sm text-gray-700">
                          Track Quantity
                        </label>
                        <input
                          type="checkbox"
                          name={`variants[${v_idx}][trackQuantity]`}
                          checked={variant.trackQuantity || false}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "trackQuantity",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Identification */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Barcode
                        </label>
                        <input
                          type="text"
                          name={`variants[${v_idx}][barcode]`}
                          value={variant.barcode || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "barcode",
                              e.target.value
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Weight
                        </label>
                        <input
                          type="number"
                          name={`variants[${v_idx}][weight]`}
                          value={variant.weight || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "weight",
                              parseFloat(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Weight Unit
                        </label>
                        <select
                          name={`variants[${v_idx}][weightUnit]`}
                          value={variant.weightUnit || "kg"}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "weightUnit",
                              e.target.value as ICreateVariant["weightUnit"]
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        >
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                          <option value="g">g</option>
                          <option value="oz">oz</option>
                        </select>
                      </div>
                    </div>

                    {/* Availability & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">
                          Default Variant
                        </label>
                        <input
                          type="checkbox"
                          name={`variants[${v_idx}][isDefault]`}
                          checked={v_idx === 0 || variant.isDefault || false}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "isDefault",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Active</label>
                        <input
                          type="checkbox"
                          name={`variants[${v_idx}][isActive]`}
                          checked={variant.isActive || false}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "isActive",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">
                          Allow Backorder
                        </label>
                        <input
                          type="checkbox"
                          name={`variants[${v_idx}][allowBackorder]`}
                          checked={variant.allowBackorder || false}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "allowBackorder",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Preorder / Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">
                          Preorder
                        </label>
                        <input
                          type="checkbox"
                          name={`variants[${v_idx}][isPreorder]`}
                          checked={variant.isPreorder || false}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "isPreorder",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Available From
                        </label>
                        <input
                          type="date"
                          name={`variants[${v_idx}][availableFrom]`}
                          value={
                            variant.availableFrom
                              ? typeof variant.availableFrom === "string"
                                ? variant.availableFrom
                                : variant.availableFrom
                                  .toISOString()
                                  .slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "availableFrom",
                              new Date(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Restock Date
                        </label>
                        <input
                          type="date"
                          name={`variants[${v_idx}][restockDate]`}
                          value={
                            variant.restockDate
                              ? typeof variant.restockDate === "string"
                                ? variant.restockDate
                                : variant.restockDate.toISOString().slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "restockDate",
                              new Date(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Preorder Date
                        </label>
                        <input
                          type="date"
                          name={`variants[${v_idx}][preorderDate]`}
                          value={
                            variant.preorderDate
                              ? typeof variant.preorderDate === "string"
                                ? variant.preorderDate
                                : variant.preorderDate
                                  .toISOString()
                                  .slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "preorderDate",
                              new Date(e.target.value)
                            )
                          }
                          className={`${inputClasses} mt-1`}
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variant Images {requiredRedAsterisk}
                      </label>
                      <input
                        type="file"
                        name={`variants[${v_idx}][images]`}
                        multiple
                        onChange={(e) =>
                          handleVariantImageUpload(e, variant.id)
                        }
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 hover:file:bg-gray-200"
                      />
                      {variant.previews.length > 0 && (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {variant.previews.map((src, i) => (
                            <div key={i} className="relative">
                              <button
                                type="button"
                                onClick={() => handleVariantImageDeletion(variant.id, i)}
                                className="absolute -top-2 -right-2 z-10 bg-white rounded-full"
                              >
                                <Trash2 size={16} className="text-red-600 hover:text-red-800" />
                              </button>
                              <img
                                alt={`Variant Image ${i + 1}`}
                                src={src}
                                className="w-full h-16 object-cover rounded border"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full flex items-center justify-center py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FiPlus className="mr-2" /> Add another variant
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Organization */}
            <div className="p-6 bg-white rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Organization
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="active"
                    className={`${inputClasses} mt-1`}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue=""
                    className={`${inputClasses} mt-1 bg-white text-black border`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="bg-white text-black"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="brandName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brand
                  </label>
                  <input
                    id="brandName"
                    name="brandName"
                    className={`${inputClasses} mt-1`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tags
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    placeholder="organic, non-gmo"
                    className={`${inputClasses} mt-1`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated values.
                  </p>
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="p-6 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Discount
                </h3>
                <div className="flex items-center">
                  <input
                    id="discount[isActive]"
                    name="discount[isActive]"
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={(e) => setDiscountEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="discount[isActive]"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Add Discount
                  </label>
                </div>
              </div>
              {discountEnabled && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      name="discount[type]"
                      value={discountType}
                      onChange={(e) =>
                        setDiscountType(e.target.value as TDiscountType)
                      }
                      className={`${inputClasses} mt-1`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="discountValue"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Value
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {discountType === "percentage" ? (
                          <span className="text-gray-400">%</span>
                        ) : (
                          <span className="text-gray-400">$</span>
                        )}
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        name="discount[value]"
                        id="discountValue"
                        placeholder="0.00"
                        className={`${inputClasses} pl-10`}
                      />
                    </div>
                  </div>
                  {discountType === "percentage" && (
                    <div>
                      <label htmlFor="maxDiscountAmount">Max Discount</label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-400">$</span>
                        </div>
                        <input
                          type="number"
                          name="discount[maxDiscountAmount]"
                          id="maxDiscountAmount"
                          placeholder="Maximum discount amount"
                          className={`${inputClasses} pl-10`}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="discountStartDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="discount[startDate]"
                        id="discountStartDate"
                        className={`${inputClasses} mt-1`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="discountEndDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        name="discount[endDate]"
                        id="discountEndDate"
                        className={`${inputClasses} mt-1`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Attribute Flags */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Attribute Flags
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="isNewArrival"
                    name="isNewArrival"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isNewArrival"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    New Arrival
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="isBestseller"
                    name="isBestseller"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isBestseller"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Bestseller
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Featured
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link
            href="/admin/products"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Product"}
          </button>
        </div>

        {state && (
          <div
            id="form-message"
            aria-atomic="true"
            aria-live="polite"
            className="mb-4 rounded-md p-4 text-sm bg-red-100 text-red-700"
          >
            {state}
          </div>
        )}

      </form>
    </div>
  );
}

