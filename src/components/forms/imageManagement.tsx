"use client";

import React from "react";

import type { IProductImage } from "@/models/modelTypes/product";

// IMAGE UPLOAD COMPONENT
export function ImageManagement({
  images,
  onAdd,
  onDelete,
  onPrimary,
}: {
  images: IProductImage[];
  onAdd: (img: IProductImage) => void;
  onDelete: (idx: number) => void;
  onPrimary: (idx: number) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    [...e.target.files].forEach(async (file, i) => {
      // TODO: Replace with actual upload to your backend/Cloudinary
      const url = URL.createObjectURL(file); // LOCAL preview
      onAdd({
        url,
        alt: file.name,
        isPrimary: images.length === 0,
        order: images.length + i,
      });
    });
    e.target.value = "";
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileRef}
        onChange={handleFile}
      />
      <button
        type="button"
        className="px-3 py-1 bg-blue-200 rounded mb-2"
        onClick={() => fileRef.current?.click()}
      >
        Upload Images
      </button>
      <div className="flex gap-3 flex-wrap mt-2">
        {images.length === 0 && (
          <div className="text-gray-500 italic">No images</div>
        )}
        {images.map((img, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <img
              src={img.url}
              alt={img.alt}
              className={`w-20 h-20 object-cover rounded border ${
                img.isPrimary ? "border-blue-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => onPrimary(i)}
              className={`text-xs mt-1 px-2 py-0.5 rounded ${
                img.isPrimary ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              disabled={img.isPrimary}
            >
              {img.isPrimary ? "Primary" : "Set as Primary"}
            </button>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onDelete(i)}
                className="absolute top-0 right-0 bg-red-600 text-white px-2 text-xs rounded"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
