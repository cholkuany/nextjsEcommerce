"use server";

// import Product from "@/models/product";
import Product from "@/models/modelTypes/product";
import { FormState } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FormDataSchema } from "@/zodSchemas/formSchema";


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

  // const priceInCents = price * 100;

  try {
    await Product.findByIdAndUpdate(
      {
        _id: productId,
      },
      {
        ...validatedFields.data,
      }
    );
    console.log("BACKEND");
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice. ${error}`,
    };
  }

  revalidatePath("/admin/products/");
  redirect("/admin/products/");
}

