"use server";

import { z } from "zod";

import dbConnect from "@/app/lib/mongodbConnection";

// import Product from "@/models/product";
import Product from "@/models/modelTypes/product";
import { IProductImage } from "@/models/modelTypes/product";
import { FormState } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { uploadImages } from "@/app/lib/cloudinary";
import { parseFormData } from "@/utils/formParser";
import { validateImages } from "@/utils/validateImages";
import { FormDataSchema } from "@/zodSchemas/formSchema";

const ProductNameSchema = z.object({
  name: z.string().min(5, "Name is required"),
});
export async function editProduct(
  productId: string,
  prevState: FormState,
  formData: FormData
) {
  // const mss = imgs.getAll("images") as File[];
  // const mss = formData.getAll("images") as File[];
  // console.log("Images to upload:", mss.length);

  // const uploadedUrls: string[] = [];
  // if (mss && mss[0].size > 0 && mss[0].name) {
  //   const { urlsOfImagesUploaded, messageStatus } = await uploadImages(mss);
  //   if (messageStatus !== "success") {
  //     return {
  //       message: messageStatus,
  //     };
  //   }
  //   uploadedUrls.push(...urlsOfImagesUploaded);
  // }
  // // Fetch the product by ID
  // await dbConnect();
  // const product = await Product.findById(productId);
  // const baseURLs =
  //   product?.baseImages.map((img: IProductImage) => img.url) || [];
  // const existingImages: string[] = baseURLs;

  // // Upload images to cloudinary and get URLs
  // uploadedUrls.push(...existingImages);

  const validatedFields = FormDataSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    // images: uploadedUrls,
  });

  console.log(validatedFields);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Product.",
    };
  }

  const { name, slug, description, category } = validatedFields.data;

  // const priceInCents = price * 100;

  try {
    // const newProduct = await Product.findByIdAndUpdate(
    //   {
    //     _id: productId,
    //   },
    //   {
    //     name: name,
    //     slug: slug,
    //     price: price,
    //     description: description,
    //     inStock: stock,
    //     category: category,
    //     images: images,
    //   }
    // );
    console.log("BACKEND");
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice. ${error}`,
    };
  }

  revalidatePath("/admin/products/");
  redirect("/admin/products/");
}

async function editUtil(name: string, productId: string, formData: FormData) {
  await dbConnect();
  const validatedFields = ProductNameSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to Update Product's Name.",
    };
  }

  console.log(validatedFields.data);

  const field = {
    [name]: validatedFields.data[name as keyof typeof validatedFields.data],
  };
  try {
    const newProduct = await Product.findByIdAndUpdate(
      {
        _id: productId,
      },
      field
    );
    console.log(`Product updated: ${productId}`);
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice. ${error}`,
    };
  }
}
function validateFormValues(formData: FormData) {
  const validated = ProductNameSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });
  return validated;
}
