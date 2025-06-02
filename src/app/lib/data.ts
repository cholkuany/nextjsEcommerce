"use server";

import Product from "@/models/product";
import Category from "@/models/category";
import dbConnect from "@/app/lib/mongodbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { LeanCategory, ProductType } from "@/types";
import { Types } from "mongoose";
import { deleteImageWithProduct } from "./cloudinary";

export type PlainCategoryType = {
  id: string;
  name: string;
  slug: string;
};

export async function fetchProductById(id: string) {
  await dbConnect();
  const objectId = new Types.ObjectId(id);

  const products: ProductType[] = await Product.aggregate([
    { $match: { _id: objectId } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        slug: 1,
        description: 1,
        price: 1,
        images: 1,
        inStock: 1,
        category: {
          id: { $toString: "$categoryInfo._id" },
          name: "$categoryInfo.name",
          slug: "$categoryInfo.slug",
        },
      },
    },
  ]);

  return products[0];
}

export async function fetchCategories() {
  await dbConnect();

  const categories = await Category.find({}, "name slug _id").lean<
    LeanCategory[]
  >();

  const newCategories = categories.map((category) => {
    return {
      name: category.name,
      slug: category.slug,
      id: category._id.toString(),
    };
  }) as PlainCategoryType[];

  return newCategories;
}

export async function fetchProducts() {
  await dbConnect();

  const products: ProductType[] = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        slug: 1,
        description: 1,
        price: 1,
        images: 1,
        inStock: 1,
        category: {
          id: { $toString: "$categoryInfo._id" },
          name: "$categoryInfo.name",
          slug: "$categoryInfo.slug",
        },
      },
    },
  ]);

  return products;
}

export async function deleteProduct(id: string) {
  await dbConnect();
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }
  try {
    // const result = await Product.deleteOne({ _id: id });
    const result = await Product.findOneAndDelete({ _id: id });
    await deleteImageWithProduct(result.images);
  } catch (err) {
    console.log("ERROR>>>*****", err);
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function fetchProductsByCategory(
  categorySlug: string,
  productName: string
) {
  await dbConnect();
  const prp: ProductType[] = await Product.aggregate([
    {
      $match: {
        name: { $not: new RegExp(`^${productName}$`, "i") },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $match: {
        "categoryInfo.slug": categorySlug,
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        slug: 1,
        description: 1,
        price: 1,
        images: 1,
        inStock: 1,
        category: {
          id: { $toString: "$categoryInfo._id" },
          name: "$categoryInfo.name",
          slug: "$categoryInfo.slug",
        },
      },
    },
  ]);

  if (prp.length === 0) {
    return [];
  }
  return prp;
}

export async function filteredProductsByQuery(query: string) {
  await dbConnect();
  const regexQuery = new RegExp(query, "i");

  const products = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    // Unwind the customer array
    { $unwind: "$categoryInfo" },
    {
      $match: {
        $or: [{ "category.name": { $regex: regexQuery } }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        price: 1,
        inStock: 1,
        name: 1,
        description: 1,
        images: 1,
        "category._id": 1,
        "category.name": 1,
        "category.slug": 1,
      },
    },
  ]);

  return products;
}

export async function groupProductsByCategory() {
  await dbConnect();
  const products: ProductType[] = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $group: {
        _id: "$categoryDetails._id",

        product: {
          $first: {
            _id: 0,
            id: { $toString: "$_id" },
            name: "$name",
            slug: "$slug",
            images: "$images",
            description: "$description",
            inStock: "$inStock",
            price: "$price",
            category: {
              id: { $toString: "$categoryDetails._id" },
              name: "$categoryDetails.name",
              slug: "$categoryDetails.slug",
            },
            // categoryName: "$categoryInfo.name",
            // categorySlug: "$categoryInfo.slug",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $replaceRoot: { newRoot: "$product" },
    },
  ]);

  return products;
}
