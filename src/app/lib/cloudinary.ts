"use server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/app/lib/mongodbConnection";

import Product from "@/models/modelTypes/product";
import { IProductImage } from "@/models/modelTypes/product";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function uploadImages(images: File[]) {
  console.log("Uploading images to Cloudinary: UPLOADIMAGES", images.length);
  const results = await Promise.all(images.map(imageUpload));

  // Collect successful URLs; if any failed, bail out
  const failedUploads = results.filter((r) => !r.ok);
  if (failedUploads.length > 0) {
    return {
      messageStatus: "One or more images failed to upload. Please try again.",
      urlsOfImagesUploaded: [] as string[],
    };
  }

  return {
    urlsOfImagesUploaded: results.map((r) => r.url) as string[],
    messageStatus: "success",
  };
}

export async function imageUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
  formData.append("folder", "products");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) return { ok: false, url: "" };

  const data = await res.json();
  return { ok: true, url: data.secure_url as string };
}

/**
 * Extracts the public ID (with folder) from a Cloudinary image URL.
 * For example:
 *  https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/products/image.jpg
 *  => products/image
 */
function getPublicIdFromUrl(
  url: string
): { folder: string; publicId: string } | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname; // /v1234567890/products/image.jpg
    const parts = path.split("/").slice(-2); // remove /v1234567890/
    // const publicIdWithExt = parts.join("/"); // products/image.jpg
    const folder = parts[0]; // products
    const imagePublicId = parts[1]; // image.jpg
    const publicId = imagePublicId.replace(/\.[^/.]+$/, ""); // remove .jpg
    return { folder: folder, publicId: publicId };
  } catch {
    return null;
  }
}
type PrevState = {
  status: string | null;
};
/**
 * Deletes an image from Cloudinary using its full URL.
 */
export async function deleteImageByUrl(prev: PrevState, formData: FormData) {
  const imageUrl = formData.get("imageUrl") as string;
  const productId = formData.get("productId") as string;

  const publicIdData = getPublicIdFromUrl(imageUrl);
  if (!publicIdData) throw new Error("Invalid Cloudinary image URL");
  const { folder, publicId } = publicIdData;
  const { status } = await deleteImageFromCloudinary(publicId, folder);
  if (status === "deleted") {
    const { status } = await deleteImageFromDatabase(productId, imageUrl);
    if (status === "deleted") {
      revalidatePath("/admin/products/edit/" + productId);
      return {
        status: "success",
      };
    }
  }
  return {
    status: "failed",
  };
}

export async function deleteImageWithProduct(images: IProductImage[]) {
  const results = {
    successCount: 0,
    failureCount: 0,
    failedImages: [] as string[],
  };

  for (const img of images) {
    const publicIdData = getPublicIdFromUrl(img.url);
    if (!publicIdData) {
      results.failureCount++;
      results.failedImages.push(img.url);
      continue; // Skip to next image
    }

    const { folder, publicId } = publicIdData;

    try {
      const { status } = await deleteImageFromCloudinary(publicId, folder);
      if (status === "deleted") {
        results.successCount++;
      } else {
        results.failureCount++;
        results.failedImages.push(img.url);
      }
    } catch{
      results.failureCount++;
      results.failedImages.push(img.url);
    }
  }

  return {
    status: results.failureCount === 0 ? "success" : "partial",
    ...results,
  };
}

async function deleteImageFromCloudinary(
  publicId: string,
  folder: string
): Promise<{ status: string }> {
  console.log(`Deleting <<${publicId}>>image from Cloudinary:`);
  // "products/r8gw32ekuwyzm1mpnpg0";
  try {
    cloudinary.api
      .delete_resources([`${folder}/${publicId}`], {
        type: "upload",
        resource_type: "image",
        invalidate: true,
      })
      .then((result) => {
        console.log("Image deleted from Cloudinary:", result);
      });
    return {
      status: "deleted",
    };
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    return { status: "failed" };
  }
}

async function deleteImageFromDatabase(
  productId: string,
  imageUrl: string
): Promise<{ status: string }> {
  try {
    await dbConnect();
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Product not found in Database");
      return { status: "failed" };
    }
    const variant = product.variants.find((v) =>
      v.images.some((img) => img.url === imageUrl)
    );
    if (!variant) {
      console.error("Variant with the specified image not found");
      return { status: "failed" };
    }
    // const newProductImagesURLs = product.baseImages.filter(
    //   (img: IProductImage) => img.url !== imageUrl
    // );
    // const newProductImagesURLs =

    await Product.updateOne(
      { _id: productId, "variants.sku": variant.sku },
      { $pull: { "variants.$.images": { url: imageUrl } } }
    );

    // await Product.findByIdAndUpdate(productId, {
    //   images: newProductImagesURLs,
    // });
    return { status: "deleted" };
  } catch (error) {
    console.error("Failed to delete image from Database:", error);
    return { status: "failed" };
  }
}
