"use client";

import { useActionState, useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { FiTag, FiLink, FiFileText, FiImage } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa";
import { MdInventory, MdCategory } from "react-icons/md";

import { PlainCategoryType } from "@/app/lib/data";
import { ProductType } from "@/types";
import Breadcrumbs from "../breadcrumbs";
import { editProduct } from "@/app/actions/editAction";
import { deleteImageByUrl } from "@/app/lib/cloudinary";
import { TiDeleteOutline } from "react-icons/ti";
import { FiCheckCircle } from "react-icons/fi";
import { Modal } from "../modal";

const initialState = {
  message: "",
  errors: {},
};
const imageState = {
  status: "",
};

export function EditProductForm({
  product,
  categories,
}: {
  product: ProductType;
  categories: PlainCategoryType[];
}) {
  // const [newImages, setImgs] = useState<FormData>(new FormData());
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Delete image by URL
  const [deletedImageState, deleteImageAction, isImageDeletionPending] =
    useActionState(deleteImageByUrl, imageState);

  // Modal setup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (deletedImageState.status === "success") {
      setModalMessage("Image deleted successfully.");
      setShowModal(true);
    } else if (deletedImageState.status === "failed") {
      setModalMessage("Failed to delete image.");
      setShowModal(true);
    }
  }, [deletedImageState.status]);

  const editProductWithId = editProduct.bind(null, product.id);
  // const editProductWithImgs = editProductWithId.bind(null, newImages);
  const [state, editFormAction, isPending] = useActionState(
    editProductWithId,
    initialState
  );

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPreviews: string[] = [];
    const uploadedFiles = Array.from(files);

    for (const file of uploadedFiles) {
      newPreviews.push(URL.createObjectURL(file));
      // setImgs((prev) => {
      //   prev.append("images", file);
      //   return prev;
      // });
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploading(false);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            {
              label: "Products",
              href: "/admin/products",
              active: false,
            },
            {
              label: "Edit",
              href: `/admin/products/edit/${product.id}`,
              active: true,
            },
          ]}
        />
      </div>

      <form action={editFormAction} className="space-y-4">
        <div className="flex flex-col p-8 bg-gray-50 rounded-md">
          {/* product's name */}
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
                  defaultValue={product.name}
                  placeholder="Product's Name"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productName"
                  aria-describedby="name-error"
                />
                <FiTag className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* slug */}
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
                  defaultValue={product.slug}
                  placeholder="Product's Slug"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500  bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productSlug"
                  aria-describedby="slug-error"
                />
                <FiLink className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* product's description */}
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
                  defaultValue={product.description}
                  placeholder="Product's Description"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productDescription"
                  aria-describedby="description-error"
                />
                <FiFileText className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* product's price */}
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
                  defaultValue={product.price.toFixed(2)}
                  placeholder="Product's Price"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500  bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productPrice"
                  aria-describedby="price-error"
                />
                <FaDollarSign className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* product's stock */}
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
                  defaultValue={product.inStock}
                  placeholder="In Stock"
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productInStock"
                  aria-describedby="stock-error"
                />
                <MdInventory className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* product's category */}
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
                  defaultValue={product.category.id}
                  aria-describedby="category-error"
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <MdCategory className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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

          {/* product's images */}
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
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="peer block w-full rounded-md py-2 pl-10 text-sm placeholder:text-gray-500 bg-white outline-1 outline-gray-200 focus:outline-blue-700"
                  id="productImages"
                  aria-describedby="images-error"
                />
                <FiImage className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
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
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500">New Images - Previews</div>
              <div className="flex flex-wrap gap-4 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img
                      src={src}
                      alt={`New Preview ${i}`}
                      className="w-full h-full object-cover rounded outline-1 outline-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPending && <p className="text-sm text-gray-500">Editing...</p>}

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
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button type="submit" className="btn">
            Edit
          </button>
        </div>
      </form>
      {product.images.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500">Existing Images</div>
          <div className="relative flex flex-wrap gap-4">
            {product.images.map((src, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={src}
                  alt={product.name}
                  className="w-full h-full object-cover rounded outline-1 outline-gray-200"
                />

                {product.images.length > 1 && (
                  <form
                    action={deleteImageAction}
                    className="absolute -top-4 -right-4"
                  >
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="imageUrl" value={src} />
                    <button
                      type="submit"
                      className="text-red-600 bg-white rounded-full hover:bg-red-100"
                      title="Delete Image"
                    >
                      <TiDeleteOutline className="w-5 h-5" />
                    </button>
                  </form>
                )}
                {showModal && (
                  <Modal
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                    icon={FiCheckCircle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
