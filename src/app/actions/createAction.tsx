"use server";

import { z } from "zod";
import { uploadImages } from "../lib/cloudinary";
import { slugifyCategory } from "@/utils/slugifyCategory";
import { ALLOWED_IMAGE_TYPES, IMAGE_SIZE_LIMIT, FormState } from "@/types";

import dbConnect from "@/app/lib/mongodbConnection";

import Category from "@/models/category";
import Product from "@/models/product";
import { ProductType } from "@/models/product";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormDataSchema = z.object({
  name: z.string().min(1, { message: "Please enter a product name." }),
  slug: z.string().min(1, { message: "Please enter a product's slug." }),
  price: z.coerce.number().gt(0, "Please enter an amount greater than $0."),
  description: z
    .string()
    .min(1, { message: "Please provide a product's description." }),
  stock: z.coerce
    .number()
    .gt(0, { message: "Please enter a valid amount of stock." }),
  category: z.string({ message: "Please select a category." }),
  // images: z.array(z.string()).min(1, "At least one image is required"),
  images: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, {
      message: "No images selected",
    })
    .refine((files) => files.length <= 3, {
      message: "Allowed maximum 3 images",
    })
    .transform((files) => files.map((file) => file as File))
    .refine(
      (files) => {
        return files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type));
      },
      {
        message:
          "At least one image required (allowed types: JPG, PNG, IVF, WEBP, JPEG, HEIC)",
      }
    )
    .refine(
      (files) => {
        return files.every((file) => file.size <= IMAGE_SIZE_LIMIT);
      },
      {
        message: "File size should not exceed 5MB",
      }
    ),
});

export async function createProductAction(
  prevState: FormState,
  formData: FormData
) {
  await dbConnect();

  const imagesFiles = formData.getAll("images") as File[];

  const validatedFields = FormDataSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    images: imagesFiles,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create product, ensure all fields are filled",
    };
  }
  // Upload images to cloudinary and get URLs
  const uploadedUrls: string[] = [];
  if (imagesFiles.length > 0) {
    // for (const image of imagesFiles) {
    //   const { ok, url } = await uploadImage(image);
    //   if (ok) {
    //     uploadedUrls.push(url);
    //   }
    // }
    const { urlsOfImagesUploaded, messageStatus } = await uploadImages(
      imagesFiles
    );
    if (messageStatus !== "success") {
      return { message: messageStatus };
    }
    uploadedUrls.push(...urlsOfImagesUploaded);
  }

  console.log("validatedFields.........", validatedFields);
  const { name, slug, price, description, stock, category } =
    validatedFields.data;

  let product: ProductType = {
    name: name,
    slug: slug,
    price: price,
    description: description,
    inStock: stock,
    images: uploadedUrls, // GOOD
    category: category,
  };

  let productCategory = await Category.findOne({ name: category });

  if (!productCategory) {
    let slug = slugifyCategory(product.category);
    try {
      await Category.create({ name: product.category, slug: slug });
    } catch (error) {
      return { message: `Failed to create category: ${error}` };
    }
  }

  try {
    const newProduct = await Product.create({
      ...product,
      category: productCategory._id,
    });
    console.log("NEW PRODUCT>>>><<<<<", newProduct);
  } catch (error) {
    return { message: "Database error, failed to create product" };
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
