"use server";

import User from "@/models/user";
import Category from "@/models/category";
import dbConnect from "@/app/lib/mongodbConnection";
import { escapeRegex } from "./utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { LeanUser, PlainCategoryType } from "@/types";
import { deleteImageWithProduct } from "./cloudinary";
import { TProduct, TCategory } from "@/types";
import Product from "@/models/modelTypes/product";

const PRODUCT_PER_PAGE = 10;

const PRODUCTS_PROJECTION = {
  _id: 0,
  id: { $toString: "$_id" },
  name: 1,
  slug: 1,
  description: 1,
  shortDescription: 1,
  categoryPath: 1,
  price: 1,
  "discount.isActive": 1,
  "discount.type": 1,
  "discount.value": 1,
  "variants.sku": 1,
  "variants.price": 1,
  "variants.stock": 1,
  "variants.images.url": 1,
  "variants.images.alt": 1,
  "variants.images.isPrimary": 1,
  "variants.images.order": 1,
  "variants.options.name": 1,
  "variants.options.value": 1,
  "variantDefinitions.name": 1,
  "variantDefinitions.values": 1,
  baseImage: 1,
  isFeatured: 1,
  isBestseller: 1,
  isNewArrival: 1,
  "reviews.averageRating": 1,
  "reviews.totalReviews": 1,
  "reviews.ratingDistribution.1": 1,
  "reviews.ratingDistribution.2": 1,
  "reviews.ratingDistribution.3": 1,
  "reviews.ratingDistribution.4": 1,
  "reviews.ratingDistribution.5": 1,
};

export async function fetchProductById(id: string) {
  await dbConnect();
  const products: TProduct[] = await Product.find({ slug: id }).lean<
    TProduct[]
  >();

  return JSON.parse(JSON.stringify(products[0]));
}

export async function fetchUsers() {
  await dbConnect();

  const users = await User.find({}).lean<LeanUser[]>();

  return users;
}

export async function fetchCategories() {
  await dbConnect();
  const categories: PlainCategoryType[] = await Category.aggregate([
    { $project: { _id: 0, id: { $toString: "$_id" }, name: 1, slug: 1 } },
  ]);

  return categories;
}

export async function fetchProducts() {
  await dbConnect();
  const products: TProduct[] = await Product.aggregate([
    {
      $project: PRODUCTS_PROJECTION,
    },
  ]);
  return JSON.parse(JSON.stringify(products));
}

export async function productsPages(query: string = "") {
  await dbConnect();
  const regexQuery = new RegExp(escapeRegex(query), "i");

  const documentCount = await Product.countDocuments({
    $or: [{ name: { $regex: regexQuery } }],
  });
  const pages = Math.ceil(documentCount / PRODUCT_PER_PAGE);
  return pages;
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
    result?.variants.forEach(async (variant) => {
      await deleteImageWithProduct(variant.images);
    });
  } catch (err) {
    console.log("ERROR>>>*****", err);
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function fetchProductsByCategory(
  categoryPath: string,
  productName: string
) {
  await dbConnect();
  const prp: TProduct[] = await Product.aggregate([
    {
      $match: {
        categoryPath: categoryPath,
      },
    },
    {
      $match: {
        name: { $not: new RegExp(`^${productName}$`, "i") },
      },
    },
    {
      $limit: 3, // Limit to 4 related products
    },
    {
      $project: PRODUCTS_PROJECTION,
    },
  ]);

  if (prp.length === 0) {
    return [];
  }
  return JSON.parse(JSON.stringify(prp));
}

export async function fetchFilteredProducts(query: string, page: number = 1) {
  await dbConnect();
  const regexQuery = new RegExp(escapeRegex(query), "i");
  const offset = PRODUCT_PER_PAGE * (page - 1);

  const products: TProduct[] = await Product.aggregate([
    {
      $match: {
        $or: [
          { categoryPath: { $regex: regexQuery } },
          { name: { $regex: regexQuery } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: PRODUCT_PER_PAGE },
    {
      $project: PRODUCTS_PROJECTION,
    },
  ]);

  return JSON.parse(JSON.stringify(products));
}

export async function groupProductsByCategory() {
  await dbConnect();
  const products: TCategory[] = await Product.aggregate([
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
        ...PRODUCTS_PROJECTION,
        categoryName: "$categoryInfo.name",
      },
    },
    {
      $group: {
        _id: "$categoryName",
        products: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 1,
        products: { $slice: ["$products", 10] },
      },
    },
  ]);
  return products;
}
