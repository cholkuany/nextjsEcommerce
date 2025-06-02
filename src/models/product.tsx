// models/Product.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: String;
  inStock: { type: Number; default: 0 };
  createdAt: Date;
  updatedAt: Date;
  category: {
    type: Schema.Types.ObjectId;
    ref: "Category";
    required: true;
  };
}

export interface ProductType {
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  inStock: number;
  category: string;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    inStock: { type: Number, default: 0 },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// 👇 Infer the type directly from the schema
// export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;

// const Product = models.Product || model("Product", ProductSchema);
const Product =
  models.Product || model<ProductDocument>("Product", ProductSchema);

export default Product;
