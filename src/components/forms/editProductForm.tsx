"use client";

import React, {
  useActionState,
  useState,
  ChangeEvent,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import { FiTag, FiLink, FiFileText, FiImage } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

import Breadcrumbs from "../breadcrumbs";
import { editProduct } from "@/app/actions/editAction";
import { deleteImageByUrl } from "@/app/lib/cloudinary";
import { TiDeleteOutline } from "react-icons/ti";
import { FiCheckCircle } from "react-icons/fi";
import { Modal } from "../modal";

import type {
  IVariantCombination,
  IVariantDefinition,
  IProductImage,
  IProductSEO,
  IDiscount,
  TDiscountType,
  IVideo,
} from "@/models/modelTypes/product";
import { TProduct, PlainCategoryType, ProductType } from "@/types";
import { VariantManagement } from "./variantManagement";
import { ImageManagement } from "./imageManagement";

const initialState = {
  message: "",
  errors: {},
};
const imageState = {
  status: "",
};

export function EditProductForm_1({
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
  const [deletedImageState, deleteImageAction] = useActionState(
    deleteImageByUrl,
    imageState
  );

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
          {/* <div className="mb-4">
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
                  defaultValue={product.price}
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
          </div> */}

          {/* product's stock */}
          {/* <div className="mb-4">
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
          </div> */}

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
            {/* <div id="images-error" aria-atomic="true" aria-live="polite">
              {state.errors?.images &&
                state.errors.images.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}{" "}
            </div> */}
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
              id="edit-form-message"
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

// Frontend Product type using your existing interface

// MAIN FORM COMPONENT UPDATED
export function EditProductForm({
  product,
  categories,
}: {
  product: TProduct;
  categories: PlainCategoryType[];
}) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Delete image by URL
  const [deletedImageState, deleteImageAction, isImageDeletionPending] =
    useActionState(deleteImageByUrl, imageState);

  // Modal setup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);

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
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploading(false);
  };

  const [form, setForm] = useState<TProduct>({ ...product });

  const [baseImages, setBaseImages] = useState<IProductImage[]>(
    form.variants[0].images || ""
  );

  const [variantDefinitions, setVariantDefinitions] = useState<
    IVariantDefinition[]
  >(form.variantDefinitions || []);

  const [variants, setVariants] = useState<IVariantCombination[]>(
    form.variants || []
  );

  const [videos, setVideos] = useState<IVideo[]>(
    form.videos || [{ url: "", title: "", thumbnail: "" }]
  );

  const [error, setError] = useState<string>("");

  function set<K extends keyof TProduct>(key: K, value: TProduct[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addVideo() {
    setVideos((videos) => [...videos, { url: "", thumbnail: "", title: "" }]);
  }

  function handleField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.value;
    const category = categories.find((c) => c.name === name);
    setForm((f) => ({
      ...f,
      categories: [category?.id ?? ""],
      categoryPath: category?.name ?? "",
    }));
  }

  function updateDiscount(patch: Partial<IDiscount>) {
    setForm((f) => ({
      ...f,
      discount: {
        ...f.discount,
        isActive:
          typeof patch.isActive === "boolean"
            ? patch.isActive
            : f.discount?.isActive ?? false,
        type: patch.type ?? f.discount?.type ?? "percentage",
        value:
          typeof patch.value === "number"
            ? patch.value
            : f.discount?.value ?? 0,
        startDate: patch.startDate ?? f.discount?.startDate ?? new Date(),
        endDate: patch.endDate ?? f.discount?.endDate ?? new Date(),
        maxDiscountAmount:
          patch.maxDiscountAmount ?? f.discount?.maxDiscountAmount ?? 0,
      },
    }));
  }

  function updateSEO<K extends keyof IProductSEO>(
    key: K,
    value: IProductSEO[K]
  ) {
    setForm((f) => ({
      ...f,
      seo: {
        ...f.seo,
        [key]: key === "keywords" ? (value as string[]) ?? [] : value,
        keywords:
          key === "keywords"
            ? (value as string[]) ?? []
            : f.seo?.keywords ?? [],
      },
    }));
  }

  // Image handlers
  function handleAddImg(newImg: IProductImage) {
    setBaseImages((old) => [
      ...old.map((i) => ({ ...i, isPrimary: false })),
      { ...newImg, isPrimary: old.length === 0 },
    ]);
  }

  function handleDelImg(idx: number) {
    setBaseImages((old) => old.filter((_, i) => i !== idx));
  }

  function handlePrimaryImg(idx: number) {
    setBaseImages((old) =>
      old.map((img, i) => ({ ...img, isPrimary: i === idx }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.slug.trim() || variants.length === 0) {
      return setError("Name, Slug, and at least one Variant are required.");
    }

    // try {
    //   await onSubmit({
    //     ...form,
    //     baseImages,
    //     variantDefinitions,
    //     variants,
    //   });
    //   alert("Saved!");
    // } catch (err: any) {
    //   setError(err?.message ?? "Save failed");
    // }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
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

      <form className="flex flex-col gap-8" action={editFormAction}>
        <h1 className="font-medium text-sm md:text-2xl mb-4 text-shadow-gray-500">
          <span className="font-light">Editing</span>
          <span className="underline underline-offset-2">{product.name}</span>
        </h1>
        {error && (
          <div className="p-2 bg-red-200 text-red-900 mb-2">{error}</div>
        )}

        {/* GENERAL INFO */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">General Info</legend>
          <div className="mb-2">
            <label className="relative">
              Name
              <input
                className="block w-full p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="name"
                // value={form.name}
                // onChange={handleField}
                defaultValue={product.name}
                id="productName"
                aria-describedby="name-error"
              />
            </label>
            <div id="name-error" aria-atomic="true" aria-live="polite">
              {state.errors?.name &&
                state.errors.name.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-2">
            <label className="relative">
              Slug
              <input
                className="block w-full p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="slug"
                // value={form.slug}
                // onChange={handleField}
                defaultValue={product.slug}
                id="productSlug"
                aria-describedby="slug-error"
              />
            </label>
            <div id="slug-error" aria-atomic="true" aria-live="polite">
              {state.errors?.slug &&
                state.errors.slug.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-2">
            <label>
              Description
              <textarea
                className="block w-full p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="description"
                // value={form.description}
                // onChange={handleField}
                defaultValue={product.description}
                aria-describedby="description-error"
              />
            </label>
            <div id="description-error" aria-atomic="true" aria-live="polite">
              {state.errors?.description &&
                state.errors.description.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-2">
            <label>
              Short Description
              <input
                className="block w-full p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="shortDescription"
                // value={form.shortDescription}
                // onChange={handleField}
                defaultValue={product.shortDescription}
                id="shortDescription"
                aria-describedby="shortDesc-error"
              />
            </label>
            <div id="shortDesc-error" aria-atomic="true" aria-live="polite">
              {state.errors?.shortDescription &&
                state.errors.shortDescription.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </fieldset>

        {/* PRICING & DISCOUNT */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Pricing & Discount</legend>
          <div className="mb-2">
            <label>
              Price
              <input
                type="number"
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="price"
                // value={form.price}
                // onChange={handleField}
                defaultValue={product.price}
                id="price"
                aria-describedby="price-error"
                disabled
              />
            </label>
            {/* <div id="price-error" aria-atomic="true" aria-live="polite">
              {state.errors?.price &&
                state.errors.price.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div> */}
          </div>
          <div className="mb-2">
            <label>
              Cost Price
              <input
                type="number"
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                name="costPrice"
                // value={form.costPrice || ""}
                // onChange={handleField}
                defaultValue={form.costPrice}
                id="costPrice"
                aria-describedby="costPrice-error"
              />
            </label>
            {/* <div id="costPrice-error" aria-atomic="true" aria-live="polite">
              {state.errors?.costPrice &&
                state.errors.costPrice.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div> */}
          </div>
          <div className="mb-2">
            <div className="border rounded mt-2 p-2">
              <label>
                <input
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600"
                  type="checkbox"
                  checked={form.discount?.isActive || false}
                  onChange={(e) =>
                    updateDiscount({ isActive: e.target.checked })
                  }
                />{" "}
                Discount Active
              </label>
              <label className="block">
                Type
                <select
                  name="discountType"
                  defaultValue={form.discount?.type}
                  // value={form.discount?.type || "percentage"}
                  // onChange={(e) =>
                  //   updateDiscount({ type: e.target.value as TDiscountType })
                  // }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </label>
              <label className="block">
                Value
                <input
                  name="discountValue"
                  type="number"
                  defaultValue={form.discount?.value}
                  // value={form.discount?.value ?? ""}
                  // onChange={(e) =>
                  //   updateDiscount({
                  //     value: e.target.value ? Number(e.target.value) : 0,
                  //   })
                  // }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 w-20 ml-2"
                  aria-describedby="discountValue-error"
                />
              </label>
              <label className="block">
                Start Date
                <input
                  type="date"
                  name="startDate"
                  defaultValue={form.discount?.startDate?.getDate() ?? ""}
                  // value={form.discount?.startDate?.getDate() ?? ""}
                  // onChange={(e) =>
                  //   updateDiscount({ startDate: new Date(e.target.value) })
                  // }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                  aria-describedby="discountStartDate-error"
                />
              </label>
              <label className="block">
                End Date
                <input
                  type="date"
                  name="endDate"
                  defaultValue={form.discount?.endDate?.getDate() ?? ""}
                  // value={form.discount?.endDate?.getDate() ?? ""}
                  // onChange={(e) =>
                  //   updateDiscount({ endDate: new Date(e.target.value) })
                  // }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                  aria-describedby="discountEndDate-error"
                />
              </label>
            </div>
            <div id="discountValue-error">
              {state.errors?.discount &&
                state.errors.discount.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </fieldset>

        {/* ADVANCED VARIANT EDITOR */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Variants & Options</legend>
          <VariantManagement
            variantDefs={variantDefinitions}
            variants={variants}
            onDefs={setVariantDefinitions}
            onVariants={setVariants}
          />
          <div>
            {product.variants.map((variant, index) => (
              <div key={index}>
                <label className="block">
                  <fieldset className="border rounded p-4">
                    <legend className="font-semibold">Variant Images</legend>
                    <ImageManagement
                      images={variant.images}
                      onAdd={handleAddImg}
                      onDelete={handleDelImg}
                      onPrimary={handlePrimaryImg}
                    />
                  </fieldset>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* CATEGORY */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Category</legend>
          <select
            value={form.categoryPath || ""}
            onChange={handleCategory}
            className="p-1 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="block">
            Category Name{" "}
            <input
              name="categoryName"
              type="text"
              value={product.categoryName}
              placeholder="e.g Bakery"
              className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
            />
          </label>
          <label className="block">
            Brand Name{" "}
            <input
              type="text"
              value={product.brandName}
              placeholder="e.g Hermes"
              className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
            />
          </label>
        </fieldset>

        {/* SEO */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">SEO</legend>
          <label>
            Meta Title
            <input
              className="block w-full p-1 border rounded mb-2"
              value={form.seo?.metaTitle || ""}
              onChange={(e) => updateSEO("metaTitle", e.target.value)}
              maxLength={60}
              placeholder="Meta Title (max 60 chars)"
            />
          </label>
          <label>
            Meta Description
            <textarea
              className="block w-full border rounded p-1 mb-2"
              value={form.seo?.metaDescription || ""}
              onChange={(e) => updateSEO("metaDescription", e.target.value)}
              maxLength={160}
              placeholder="Meta Description (max 160 chars)"
            />
          </label>
          <label>
            SEO Keywords (comma separated)
            <input
              className="block w-full p-1 border rounded"
              value={form.seo?.keywords?.join(", ") || ""}
              onChange={(e) =>
                updateSEO(
                  "keywords",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="e.g. sneakers, running shoes, men's shoes"
              maxLength={200}
            />
          </label>
        </fieldset>

        {/* STATUS AND FLAGS */}
        <fieldset className="border rounded p-4 flex flex-wrap gap-x-10 gap-y-2 items-center">
          <legend className="font-semibold">Status & Flags</legend>
          <div>
            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleField}
                className="ml-2 border rounded p-1"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="isVisible"
                value={String(form.isVisible)}
                checked={form.isVisible ?? false}
                onChange={handleField}
                className="mr-1"
              />
              Visible
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleField}
                className="mr-1"
              />
              Featured
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="isBestseller"
                checked={form.isBestseller}
                onChange={handleField}
                className="mr-1"
              />
              Bestseller
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleField}
                className="mr-1"
              />
              New Arrival
            </label>
          </div>
        </fieldset>

        {/* Analysis */}
        <fieldset className="w-full border rounded p-4 flex flex-wrap gap-x-10 gap-y-2 items-center">
          <legend className="font-semibold">Analytics</legend>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <label className="block">
              Last Purchase
              <input
                name="lastPurchased"
                type="date"
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                value={
                  new Date(product.analytics.lastPurchased).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }
                  ) ?? ""
                }
              />
            </label>
            <label className="block">
              Purchase Count{" "}
              <input
                name="purchaseCount"
                type="number"
                value={product.analytics.purchaseCount}
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2 w-full md:w-20"
              />
            </label>
            <label className="block">
              Popularity{" "}
              <input
                name="popularity"
                type="number"
                value={product.analytics.popularity}
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2 w-full md:w-20"
              />
            </label>
            <label className="block">
              View Count{" "}
              <input
                value={product.analytics.viewCount}
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2 w-full md:w-20"
              />
            </label>
            <label className="block">
              Wishlist count{" "}
              <input
                value={product.analytics.wishlistCount}
                className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2 w-full md:w-20"
              />
            </label>
          </div>
        </fieldset>
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Videos</legend>
          {videos?.map((video) => (
            <div>
              <label>
                Video <video src={video.url}></video>
              </label>
              <label>
                Thumbnail <input value={video.thumbnail} />
              </label>
              <label>
                Title <input value={video.title} />
              </label>
            </div>
          ))}
          <button onClick={addVideo} className="bg-blue-500">
            Add video
          </button>
        </fieldset>

        {/* IMAGE UPLOAD AND MANAGEMENT */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Images</legend>
          <ImageManagement
            images={baseImages}
            onAdd={handleAddImg}
            onDelete={handleDelImg}
            onPrimary={handlePrimaryImg}
          />
        </fieldset>

        {/* SUBMIT */}
        <div className="pt-2 flex gap-3 justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
