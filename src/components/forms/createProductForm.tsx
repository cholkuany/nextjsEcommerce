"use client";

import Link from "next/link";
import clsx from "clsx";

import { useState, ChangeEvent, useActionState } from "react";
import { createProductAction } from "../../app/actions/createAction";
import { FiTag, FiLink, FiFileText, FiImage } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa";
import { MdInventory, MdCategory } from "react-icons/md";
import Breadcrumbs from "@/components/breadcrumbs";
import { PlainCategoryType } from "@/app/lib/data";

const initialState = { errors: {}, message: "" };

export function CreateProductForm({
  categories,
}: {
  categories: PlainCategoryType[];
}) {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );

  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPreviews: string[] = [];

    const uploadedFiles = Array.from(files);

    for (const file of uploadedFiles) {
      newPreviews.push(URL.createObjectURL(file));
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploading(false);
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/admin", active: false },
            {
              label: "Products",
              href: "/admin/products",
              active: false,
            },
            {
              label: "Create",
              href: "/admin/products/create",
              active: true,
            },
          ]}
        />
      </div>
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col p-8 rounded-md bg-gray-50">
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="mb-2 block text-sm font-medium"
            >
              Product Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  name="name"
                  placeholder="Product's Name"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productName"
                  aria-describedby="name-error"
                />
                <FiTag className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="name-error" aria-atomic="true" aria-live="polite">
              {state.errors?.name &&
                state.errors.name.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productSlug"
              className="mb-2 block text-sm font-medium"
            >
              Product Slug
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  name="slug"
                  placeholder="Product's Slug"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productSlug"
                  aria-describedby="slug-error"
                />
                <FiLink className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="slug-error" aria-atomic="true" aria-live="polite">
              {state.errors?.slug &&
                state.errors.slug.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="productDescription"
              className="mb-2 block text-sm font-medium"
            >
              Product Description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  name="description"
                  placeholder="Product's Description"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productDescription"
                  aria-describedby="description-error"
                />
                <FiFileText className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="description-error" aria-atomic="true" aria-live="polite">
              {state.errors?.description &&
                state.errors.description.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productPrice"
              className="mb-2 block text-sm font-medium"
            >
              Product Price
            </label>
            <div className="relative mt-2 rounded-md overflow-hidden">
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  step={0.01}
                  placeholder="Product's Price"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productPrice"
                  aria-describedby="price-error"
                />
                <FaDollarSign className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="price-error" aria-atomic="true" aria-live="polite">
              {state.errors?.price &&
                state.errors.price.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="productInStock"
              className="mb-2 block text-sm font-medium"
            >
              Product In Stock
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  name="stock"
                  type="number"
                  placeholder="In Stock"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productInStock"
                  aria-describedby="stock-error"
                />
                <MdInventory className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="stock-error" aria-atomic="true" aria-live="polite">
              {state.errors?.stock &&
                state.errors.stock.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="productCategory"
              className="mb-2 block text-sm font-medium"
            >
              Product Category
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <select
                  name="category"
                  aria-placeholder="Select a category"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productCategory"
                  defaultValue=""
                  aria-describedby="category-error"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  {/* Example categories */}
                </select>
                <MdCategory className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="category-error" aria-atomic="true" aria-live="polite">
              {state.errors?.category &&
                state.errors.category.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productImages"
              className="mb-2 block text-sm font-medium"
            >
              Product images
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productImages"
                  aria-describedby="images-error"
                />
                <FiImage className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 peer-focus:text-black" />
              </div>
            </div>
            <div id="images-error" aria-atomic="true" aria-live="polite">
              {state.errors?.images &&
                state.errors.images.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}{" "}
            </div>
          </div>

          {uploading && (
            <p className="text-sm text-gray-500">Uploading images...</p>
          )}

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}

          {isPending && <p className="text-sm text-gray-500">Creating...</p>}
        </div>

        {state.message && (
          <div
            id=""
            aria-atomic="true"
            aria-live="polite"
            className="mt-4 rounded-md p-4 text-sm bg-red-100 text-red-700"
          >
            {state.message}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={clsx("btn", {
              "pointer-events-none bg-gray-400": isPending,
            })}
            disabled={isPending}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
