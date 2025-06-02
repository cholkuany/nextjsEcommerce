"use server";

import { z } from "zod";

import dbConnect from "@/app/lib/mongodbConnection";

import Product from "@/models/product";
import { FormState } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { uploadImages } from "@/app/lib/cloudinary";
import { parseFormData } from "@/utils/formParser";
import { validateImages } from "@/utils/validateImages";

const FormDataSchema = z.object({
  name: z.string().min(5, "Name is required"),
  slug: z.string().min(5, "Slug is required"),
  price: z.coerce.number().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  stock: z.coerce.number().min(1, "In Stock is required"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export async function editProduct(
  productId: string,
  prevState: FormState,
  formData: FormData
) {
  // const mss = imgs.getAll("images") as File[];
  const mss = formData.getAll("images") as File[];

  console.log("Images to upload:", mss.length);

  const uploadedUrls: string[] = [];
  if (mss && mss[0].size > 0 && mss[0].name) {
    const { urlsOfImagesUploaded, messageStatus } = await uploadImages(mss);
    if (messageStatus !== "success") {
      return {
        message: messageStatus,
      };
    }
    uploadedUrls.push(...urlsOfImagesUploaded);
  }
  // Fetch the product by ID
  await dbConnect();
  const product = await Product.findById(productId);
  const existingImages: string[] = product?.images || [];
  // Upload images to cloudinary and get URLs

  uploadedUrls.push(...existingImages);

  // if (uploadedUrls.length < mss.length) {
  //   return {
  //     message: "Some images failed to upload. Please try again.",
  //   };
  // }

  console.log({
    ...Object.fromEntries(formData.entries()),
    images: uploadedUrls,
  });

  const validatedFields = FormDataSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    images: uploadedUrls,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Product.",
    };
  }

  const { name, slug, price, description, stock, category, images } =
    validatedFields.data;

  // const priceInCents = price * 100;

  try {
    const newProduct = await Product.findByIdAndUpdate(
      {
        _id: productId,
      },
      {
        name: name,
        slug: slug,
        price: price,
        description: description,
        inStock: stock,
        category: category,
        images: images,
      }
    );
    console.log(`Product updated: ${productId}`);
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice. ${error}`,
    };
  }

  revalidatePath("/admin/products/");
  redirect("/admin/products/");
}
