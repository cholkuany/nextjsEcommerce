"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Product = {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  inStock: number;
  description: number;
  category: string;
  images: string[];
};

const categories = ["clothing", "electronics", "books", "home"];

export default function ProductForm(product: Product) {
  const [form, setForm] = useState<Product>(product);

  const [imagePreview, setImagePreview] = useState(form.images || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? +value : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.secure_url }));
    setImagePreview(data.secure_url);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = product ? "PUT" : "POST";
    const endpoint = product
      ? `/api/admin/products/${product._id}`
      : `/api/admin/products`;

    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        className="input"
        placeholder="Name"
      />
      <input
        name="slug"
        value={form.slug}
        onChange={handleChange}
        required
        className="input"
        placeholder="Slug"
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
        className="input"
        placeholder="Price"
      />
      <input
        name="stock"
        type="number"
        value={form.inStock}
        onChange={handleChange}
        required
        className="input"
        placeholder="Stock"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="input"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <div>
        <label className="block mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="input"
        />
        {loading && <p>Uploading...</p>}
        {form.images && (
          <img
            src={form.images[0]}
            alt="Preview"
            className="w-32 mt-2 rounded border"
          />
        )}
      </div>

      <button type="submit" className="btn">
        {product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
