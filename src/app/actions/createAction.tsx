"use server";

import { Types } from "mongoose";
import { uploadImages } from "../lib/cloudinary";

import Category, { ICategory } from "@/models/category";
import Product, {
  IVariantOption,
  IVariantCombination,
  IDiscount,
} from "@/models/modelTypes/product";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormDataSchema } from "@/zodSchemas/formSchema";
import { ICreateVariant } from "@/components/forms/createProductForm";

function normalizeDiscount(raw: Partial<IDiscount> | undefined, basePrice: number): IDiscount | undefined {
  if (!raw) return undefined;

  const d = raw;

  if (!d.type || d.value == null) return undefined;

  const normalized: IDiscount = {
    isActive: true,
    type: d.type,
    value: Number(d.value),
    startDate: d.startDate ? new Date(d.startDate) : undefined,
    endDate: d.endDate ? new Date(d.endDate) : undefined,
  };

  const now = new Date();
  if (normalized.startDate && normalized.startDate > now) {
    normalized.isActive = false;
  }

  if (d.type === "percentage") {
    normalized.value = Math.min(Math.max(normalized.value, 0), 100);
    if (d.maxDiscountAmount != null) {
      normalized.maxDiscountAmount = Number(d.maxDiscountAmount);
    }
  }

  if (d.type === "fixed") {
    normalized.value = Math.min(normalized.value, basePrice);
  }

  return normalized;
}

export async function createProductAction(
  formData: FormData
) {

  const vnts = JSON.parse(formData.get("variants") as string);

  if (!Array.isArray(vnts) || vnts.length === 0) {
    return { message: "At least one variant is required" };
  }

  let costPrice: number = 0;
  let price: number = 0;

  type TValidateVar = Omit<ICreateVariant, "previews">;
  const defaultVariants = vnts.filter((v: TValidateVar) => v.isDefault);

  const resolvedDefault =
    defaultVariants.length > 0
      ? defaultVariants[0]
      : vnts[0];

  price = resolvedDefault.price;
  costPrice = resolvedDefault.compareAtPrice ?? 0;

  const varArr = vnts
    ? vnts.map((v: TValidateVar) => {

      if (v.preorderDate) {
        v.preorderDate = new Date(v.preorderDate);
      }
      if (v.restockDate) {
        v.restockDate = new Date(v.restockDate);
      }
      if (v.availableFrom) {
        v.availableFrom = new Date(v.availableFrom);
      }
      if (v.discontinuedDate) {
        v.discontinuedDate = new Date(v.discontinuedDate);
      }
      return {
        ...v,
        isDefault: v.id === resolvedDefault.id,
        options:
          v.options?.map((option: IVariantOption) => ({
            name: option.name,
            value: option.value,
          })) ?? [],
        images: formData.getAll(`variantImages[${v.id}]`) as File[],
      };
    })
    : [];

  console.log("Variant ARRAY MODIFIED:::>>>", varArr);

  // -------- Discount --------
  const rawDiscount = formData.get("discount") as string;
  const discount = normalizeDiscount(
    rawDiscount ? JSON.parse(rawDiscount) : undefined,
    price
  );


  const validatedFields = FormDataSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    variants: varArr,
    ...(discount ? { discount } : {}),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
    };
  }

  const validatedData = validatedFields.data;

  // 1. Validate each variant
  const parsedVariants: IVariantCombination[] = [];
  let baseImageUrl = "";

  for (let i = 0; i < validatedData.variants.length; i++) {
    const v = validatedData.variants[i];

    let imageUrls: string[] = [];
    if (v.images.length > 0) {
      const { urlsOfImagesUploaded, messageStatus } = await uploadImages(v.images);
      if (messageStatus !== "success") {
        throw new Error(`Variant ${i + 1}: image upload failed`);
      }
      imageUrls = urlsOfImagesUploaded;
    }

    const parsedImages = imageUrls.map((url, idx) => ({
      url,
      alt: v.sku.slice(0, 20),
      isPrimary: idx === 0,
      order: idx,
    }));

    if (!baseImageUrl && v.isDefault && parsedImages[0]) {
      baseImageUrl = parsedImages[0].url;
    }

    parsedVariants.push({
      ...v,
      images: parsedImages,
    });
  }

  console.log("parsed VARIANTs:::", parsedVariants);

  // 6. Ensure category exists
  interface TCat extends ICategory {
    _id: Types.ObjectId;
  }
  const productCategory: TCat | null = await Category.findById(
    validatedFields.data.category
  );
  if (!productCategory) {
    return { message: "Selected category not found" };
  }
  // Construct categoryPath
  let categoryPath = "";
  const categoryName = productCategory.name;
  if (productCategory) {
    const ancestors = productCategory.ancestors
      ? productCategory.ancestors.map((a) => a.name)
      : [];
    categoryPath = [...ancestors, productCategory.name].join("/");
  }

  // 7. Create product
  try {
    const newProduct = await Product.create({
      ...validatedFields.data,
      price: price!,
      costPrice: costPrice!,
      categoryName: categoryName,
      categoryPath: categoryPath,
      variants: parsedVariants,
      baseImage: baseImageUrl,
      name: validatedFields.data.name,
      slug: validatedFields.data.slug,
      description: validatedFields.data.description,
      shortDescription: validatedFields.data.shortDescription,
      status: validatedFields.data.status,
      brandName: validatedFields.data.brandName,
      tags: validatedFields.data.tags,
      isNewArrival: validatedData.isNewArrival,
      isFeatured: validatedData.isFeatured,
      isBestseller: validatedData.isBestseller,
    });
    console.log("NEW PRODUCT:", newProduct);
  } catch (err) {
    console.log("ERRRR::::", err);
    return { message: "Database error, failed to create product" };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
