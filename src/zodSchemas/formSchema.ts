import { z } from "zod";
import { ALLOWED_IMAGE_TYPES, IMAGE_SIZE_LIMIT } from "@/types";

export function errorUtil(fieldName: string) {
  return {
    path: [`${fieldName}`],
    code: z.ZodIssueCode.custom,
    message: `${fieldName} is required when discount is active`,
  };
}
const roundTo2Decimals = (num: number) => Math.round(num * 100) / 100;
const nonNegativeMoney = z.number().min(0).transform(roundTo2Decimals);

const discountCoreSchema = z.object({
  type: z.literal("percentage").or(z.literal("fixed")).optional(),
  value: nonNegativeMoney.optional(),
  isActive: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxDiscountAmount: nonNegativeMoney.optional(),
  deletedAt: z.date().optional(),
});

export const discountSchema = discountCoreSchema
  // .merge(discountConditionsSchema)
  .transform((data) => {
    if (!data.isActive) {
      return {
        ...data,
        type: data.type ?? "percentage",
        value: data.value ?? 0,
        startDate: data.startDate ?? new Date(),
        endDate: data.endDate ?? new Date(),
      };
    }
    return data;
  })
  .superRefine((data, ctx) => {
    if (data.isActive) {
      if (!data.type) {
        ctx.addIssue(errorUtil("type"));
      }

      if (data.value === undefined) {
        ctx.addIssue(errorUtil("value"));
      }

      if (!data.startDate) {
        ctx.addIssue(errorUtil("startDate"));
      }

      if (!data.endDate) {
        ctx.addIssue(errorUtil("endDate"));
      }

      // 📆 Validate date logic
      if (data.startDate && data.endDate) {
        if (data.startDate.getTime() >= data.endDate.getTime()) {
          ctx.addIssue({
            path: ["endDate"],
            code: z.ZodIssueCode.custom,
            message: "endDate must be after startDate",
          });
        }

        // 📆 Limit discount period to 30 days
        const diffInMs = data.endDate.getTime() - data.startDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if (diffInDays > 30) {
          ctx.addIssue({
            path: ["endDate"],
            code: z.ZodIssueCode.custom,
            message: "Discount period cannot be longer than 30 days",
          });
        }
        // if type is percentage, maxDiscountAmount must be defined
        if (data.type === "percentage") {
          // 1. maxDiscountAmount required
          if (!data.maxDiscountAmount) {
            ctx.addIssue({
              path: ["maxDiscountAmount"],
              code: z.ZodIssueCode.custom,
              message: "maxDiscountAmount is required for percentage discounts",
            });
          }
          // 2. value must not exceed 100
          if (data.value && data.value > 100) {
            ctx.addIssue({
              path: ["value"],
              code: z.ZodIssueCode.custom,
              message: "Percentage discount cannot exceed 100%",
            });
          }

          // 3. maxDiscountAmount must be > 0
          if (
            data.maxDiscountAmount !== undefined &&
            data.maxDiscountAmount <= 0
          ) {
            ctx.addIssue({
              path: ["maxDiscountAmount"],
              code: z.ZodIssueCode.custom,
              message: "Max discount must be greater than 0",
            });
          }
        }
      }
    }
  });

// const fullSchema = z.object({
//   discount: discountSchema.optional(),
// });

// {
//   _id: ObjectId("..."),
//   type: "percentage",
//   value: 20,
//   isActive: true,
//   startDate: ISODate("2025-09-01"),
//   endDate: ISODate("2025-09-30"),
//   applicableProductIds: [ObjectId("..."), ObjectId("...")],
//   applicableCategoryIds: [],
//   ...
// }

// schemas/productSchema.ts
// Convert form "on"/"" to boolean
export const checkboxToBoolean = z.preprocess(
  (val) => (val === "on" ? true : false),
  z.boolean()
);
// Convert empty string to undefined
export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);
// Parse comma-separated tags
export const tagsPreprocess = z.preprocess((val) => {
  if (typeof val === "string") {
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return val;
}, z.array(z.string()));

export const ImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  isPrimary: z.boolean(),
  order: z.coerce.number(),
});
export const ImagesSchema = z
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
  );

export const FormDataSchema = z.object({
  // Basic Information
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(5, "Description is required"),
  shortDescription: z.string().min(5, "Short description is required"),
  // categoryName: z.string().min(3, "Category is required"),
  // Discount structure
  discount: discountSchema.optional(),
  // Define what variant types exist (Size, Color, etc.)
  variantDefinitions: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
        displayType: z
          .enum(["dropdown", "swatch", "button", "image"])
          .optional(),
      })
    )
    .optional(),
  // All possible combinations with their specific data
  variants: z.array(
    z.object({
      options: z.array(z.object({ name: z.string(), value: z.string() })),
      sku: z.string().min(1, "SKU is required"),
      price: z.preprocess(
        (v) => parseFloat(v as string),
        z.number().min(0.01, "Variant price is required").positive()
      ),
      compareAtPrice: z.coerce.number().optional(),
      stock: z.preprocess(
        (v) => parseInt(v as string, 10),
        z.number().int().min(0, "Stock is required")
      ),
      barcode: z.string().optional(),
      weight: z.coerce.number().optional(),
      images: ImagesSchema,
      isDefault: checkboxToBoolean.optional(),
      isActive: checkboxToBoolean.optional(),

      lowStockThreshold: z.coerce
        .number()
        .min(10, "low stock threshold is required"),
      trackQuantity: checkboxToBoolean.optional(),
      allowBackorder: checkboxToBoolean.optional(),
      preorderDate: z.date().optional(),
      discontinuedDate: z.date().optional(),
      restockDate: z.date().optional(),
      weightUnit: z.enum(["kg", "lb", "g", "oz"]).optional(),
      // Preorder / Availability
      isPreorder: z.boolean().optional(),
      availableFrom: z.date(),
    })
  ),
  // Media
  // baseImages: ImagesSchema,
  videos: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        thumbnail: z.string(),
      })
    )
    .optional(),

  // Digital Products
  isDigital: z.boolean().optional(),
  digitalFile: z
    .object({
      url: z.string(),
      fileType: z.string(),
      fileSize: z.coerce.number(),
    })
    .optional(),
  // Tax
  isTaxable: z.boolean().default(true),
  taxClass: z.enum(["standard", "reduced", "none"]).default("standard"),
  // Denormalized data (optional performance boost)
  brandName: emptyToUndefined(z.string()).optional(),
  vendorName: emptyToUndefined(z.string()).optional(),
  // Categories and Organization
  categoryPath: z.string().optional(),
  category: z.string(),
  tags: tagsPreprocess.optional(),

  // Physical Properties
  dimensions: z
    .object({
      length: z.coerce.number(),
      width: z.coerce.number(),
      height: z.coerce.number(),
      unit: z.enum(["cm", "in"]),
    })
    .optional(),
  // Unit Pricing
  unitPrice: z
    .object({
      amount: z.coerce.number(),
      unit: z.string(),
    })
    .optional(),

  // Shipping
  shipping: z
    .object({
      weight: z.coerce.number(),
      requiresShipping: z.coerce.boolean(),
      shippingClass: z.enum(["standard", "express", "overnight", "free"]),
      freeShippingThreshold: z.coerce.number(),
    })
    .optional(),

  // Product Status
  status: z.enum(["draft", "active", "inactive", "archived"]).default("active"),
  isVisible: checkboxToBoolean.optional(),
  // Flags
  isNewArrival: checkboxToBoolean.optional(),
  isBestseller: checkboxToBoolean.optional(),
  isFeatured: checkboxToBoolean.optional(),

  // Reviews and Ratings
  reviews: z
    .object({
      averageRating: z.coerce.number(),
      totalReviews: z.coerce.number(),
      ratingDistribution: z.object({
        5: z.coerce.number(),
        4: z.coerce.number(),
        3: z.coerce.number(),
        2: z.coerce.number(),
        1: z.coerce.number(),
      }),
    })
    .optional(),

  // SEO
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()),
    })
    .optional(),

  // Additional Product Information
  specifications: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        category: z.enum(["technical", "physical", "features"]),
        order: z.coerce.number(),
      })
    )
    .optional(),

  // Sales Analytics
  analytics: z
    .object({
      viewCount: z.coerce.number(),
      purchaseCount: z.coerce.number(),
      wishlistCount: z.coerce.number(),
      lastPurchased: z.date(),
      popularity: z.coerce.number(),
    })
    .optional(),

  // Related Products
  relatedProducts: z.array(z.string()).optional(),
  crossSellProducts: z.array(z.string()).optional(),

  // Admin fields
  createdBy: z.string().optional(),
  lastModifiedBy: z.string().optional(),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export const VariantOptionSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const VariantSchema = z.object({
  options: z.array(VariantOptionSchema).optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.preprocess(
    (v) => parseFloat(v as string),
    z.number().min(0.01, "Variant price is required").positive()
  ),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.preprocess(
    (v) => parseInt(v as string, 10),
    z.number().int().min(0, "Stock is required")
  ),
  barcode: z.string().optional(),
  weight: z.coerce.number().optional(),
  images: z.array(z.string().url()).optional(),
  isDefault: checkboxToBoolean.optional(),
  isActive: checkboxToBoolean.optional(),

  lowStockThreshold: z.coerce
    .number()
    .min(10, "low stock threshold is required")
    .optional(),
  trackQuantity: checkboxToBoolean.optional(),
  allowBackorder: checkboxToBoolean.optional(),
  preorderDate: z.date().optional(),
  discontinuedDate: z.date().optional(),
  restockDate: z.date().optional(),
  weightUnit: z.enum(["kg", "lb", "g", "oz"]),
  // Preorder / Availability
  isPreorder: z.boolean(),
  availableFrom: z.date(),
});

export const DiscountSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const ZodProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  brandName: z.string().optional(),
  tags: z.string().optional(),
  // Denormalized data (optional performance boost)
  // categoryName: z.string(),
  vendorName: emptyToUndefined(z.string()).optional(),
  discount: DiscountSchema.optional(),
  variants: z.array(VariantSchema),
  status: z.enum(["draft", "active", "inactive", "archived"]).default("active"),
  isVisible: checkboxToBoolean.optional(),
  // Flags
  isNewArrival: checkboxToBoolean.optional(),
  isBestseller: checkboxToBoolean.optional(),
  isFeatured: checkboxToBoolean.optional(),

  videos: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        thumbnail: z.string(),
      })
    )
    .optional(),

  // Digital Products
  isDigital: z.boolean().optional(),
  digitalFile: z
    .object({
      url: z.string(),
      fileType: z.string(),
      fileSize: z.coerce.number(),
    })
    .optional(),

  // Tax
  isTaxable: z.boolean().default(true),
  taxClass: z.enum(["standard", "reduced", "none"]).default("standard"),

  // Admin fields
  createdBy: z.string().optional(),
  lastModifiedBy: z.string().optional(),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export type ZodProductInput = z.infer<typeof ZodProductSchema>;
