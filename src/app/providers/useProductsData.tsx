import { createContext, useContext, useState, useEffect } from "react";
import Product, { ProductDocument } from "@/models/product";
import dbConnect from "@/app/lib/mongodbConnection";

export const ProductsContext = createContext<Array<ProductDocument>>([]);

export async function useProducts() {
  return useContext(ProductsContext);
}

export async function useProductsData() {
  await dbConnect();
  const productsData = await Product.find().lean().populate("category");

  const products = productsData.map((product: any) => ({
    id: product._id?.toString() || "",
    url: product.url || "",
    height: product.height || 0,
    width: product.width || 0,
  }));

  return products;
}
