// product.ts
import mongoose, { Schema, models, model, Model } from "mongoose";

const VariantOptionSchema = new Schema<IVariantOption>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

export const ProductSEOSchema = new Schema<IProductSEO>({
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  keywords: [{ type: String, lowercase: true, trim: true, maxlength: 50 }],
});

export const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

export const ProductDimensionsSchema = new Schema<IProductDimensions>({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  unit: { type: String, enum: ["cm", "in"], default: "cm" },
});

export const VariantDefinitionSchema = new Schema<IVariantDefinition>({
  name: { type: String, required: true },
  values: [{ type: String, required: true }],
  displayType: {
    type: String,
    enum: ["dropdown", "swatch", "button", "image"],
    default: "dropdown",
  },
});

export const ProductReviewsSchema = new Schema<IProductReviews>({
  averageRating: {
    type: Number,
    default: null,
    min: 0,
    max: 5,
    set: (val: number | null) => {
      if (val === null || val === undefined) return null;
      return Math.round(val * 10) / 10;
    },
  },
  totalReviews: { type: Number, default: 0, min: 0 },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
  },
});

export const VariantCombinationSchema = new Schema<IVariantCombination>({
  options: {
    type: [VariantOptionSchema],
    required: true,
    validate: {
      validator: function (options: IVariantOption[]) {
        return options.length > 0;
      },
      message: "A variant must have at least one option",
    },
  }, // Array of variant options
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  }, // Unique SKU for this combination
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  barcode: { type: String, sparse: true, unique: true }, // Allows multiple null values
  compareAtPrice: { type: Number }, // Original price if on sale
  weight: { type: Number, default: 0 }, // Weight for shipping calculations
  weightUnit: { type: String, enum: ["kg", "lb", "g", "oz"], default: "kg" },
  images: [ProductImageSchema], // Specific images for this variant
  isDefault: { type: Boolean, default: false }, // Default variant to show
  isActive: { type: Boolean, default: true }, // Can be temporarily disabled

  lowStockThreshold: { type: Number, default: 10 },
  trackQuantity: { type: Boolean, default: false },
  allowBackorder: { type: Boolean, default: false },
  preorderDate: { type: Date }, // When preorder becomes available
  discontinuedDate: { type: Date }, // When product was discontinued
  restockDate: { type: Date }, // Expected restock date

  isPreorder: { type: Boolean, default: false },
  availableFrom: { type: Date },
});

// Define interfaces for better type safety
export interface IVariantOption {
  name: string; // "Size", "Color", "Material"
  value: string; // "Large", "Red", "Cotton"
}
export type TWeightUnit = "kg" | "lb" | "g" | "oz";

export interface IVariantCombination {
  options: IVariantOption[];
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  barcode?: string;
  weight?: number;
  images: IProductImage[];
  isDefault?: boolean;
  isActive?: boolean;

  lowStockThreshold: number;
  trackQuantity?: boolean;
  allowBackorder?: boolean;
  preorderDate?: Date;
  discontinuedDate?: Date;
  restockDate?: Date;

  weightUnit?: TWeightUnit;

  // Preorder / Availability
  isPreorder?: boolean;
  availableFrom?: Date;
}

export interface IVariantDefinition {
  name: string; // "Size", "Color", etc.
  values: string[]; // ["Small", "Medium", "Large"]
  displayType?: TDisplayType;
}

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface IProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface IProductReviews {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface IDiscount {
  isActive: boolean;
  type: TDiscountType;
  value: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  maxDiscountAmount?: number; // For percentage discounts
  deletedAt?: Date;
}

export interface IVideo {
  url: string;
  title: string;
  thumbnail: string;
}

export type TTax = "standard" | "reduced" | "none";
export type TShipping = "standard" | "express" | "overnight" | "free";

export type TDiscountType = "percentage" | "fixed";
export type TProductStatus = "draft" | "active" | "inactive" | "archived";
export type TDisplayType = "dropdown" | "swatch" | "button" | "image";

export interface IProduct<T = mongoose.Types.ObjectId> {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  shortDescription: string;

  // Pricing
  price: number;
  costPrice?: number;

  // Discount structure
  discount?: IDiscount;

  // Define what variant types exist (Size, Color, etc.)
  variantDefinitions?: IVariantDefinition[];

  // All possible combinations with their specific data
  variants: IVariantCombination[];

  // Media
  baseImage: string;

  videos?: IVideo[];

  // Digital Products
  isDigital?: boolean;
  digitalFile?: {
    url: string;
    fileType: string; // e.g., "pdf", "mp3"
    fileSize: number; // bytes
  };

  // Tax
  isTaxable: boolean;
  taxClass: TTax;

  // Denormalized data (optional performance boost)
  categoryName: string;
  brandName?: string;
  vendorName?: string;

  // Categories and Organization
  categoryPath: string; // e.g. "electronics/phones/smartphones"
  category: mongoose.Types.ObjectId;
  tags?: string[];

  // Physical Properties
  dimensions?: IProductDimensions;
  // Unit Pricing
  unitPrice?: {
    amount: number;
    unit: string; // e.g. "kg", "100ml", etc.
  };

  // Shipping
  shipping?: {
    weight: number;
    requiresShipping: boolean;
    shippingClass: TShipping;
    freeShippingThreshold: number;
  };

  // Product Status
  status: TProductStatus;
  isVisible: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;

  // Reviews and Ratings
  reviews?: IProductReviews;

  // SEO
  seo?: IProductSEO;

  // Additional Product Information
  specifications?: {
    name: string;
    value: string;
    category: "technical" | "physical" | "features";
    order: number;
  }[];

  // Sales Analytics
  analytics: {
    viewCount: number;
    purchaseCount: number;
    wishlistCount: number;
    lastPurchased: Date;
    popularity: number; // Can be calculated based on views, purchases, etc.
  };

  // Related Products
  relatedProducts: T[];
  crossSellProducts: T[];

  // Admin fields
  createdBy: T;
  lastModifiedBy: T;

  createdAt?: Date;
  updatedAt?: Date;
}
export interface IProductMethods {
  updatePopularity(): Promise<ProductDocument>;
  addView(): Promise<ProductDocument>;

  findVariant(options: IVariantOption[]): IVariantCombination | undefined;
  getAvailableOptions(variantName: string): string[] | undefined;
  isVariantAvailable(options: IVariantOption[]): boolean;
}

export interface IStockReport {
  lowStock: number;
  outOfStock: number;
  critical: number;
  products: {
    lowStock: ProductDocument[];
    outOfStock: ProductDocument[];
    critical: ProductDocument[];
  };
}

export type ProductDocument = mongoose.HydratedDocument<
  IProduct<mongoose.Types.ObjectId>,
  IProductMethods
>;

export interface IProductModel
  extends Model<IProduct<mongoose.Types.ObjectId>, unknown, IProductMethods> {
  getLowStockProducts(threshold?: number): Promise<ProductDocument[]>;
  getOutOfStockProducts(): Promise<ProductDocument[]>;
  getCriticalStockProducts(): Promise<ProductDocument[]>;
  getStockReport(): Promise<IStockReport>;
}

export const ProductSchema = new Schema<
  IProduct<mongoose.Types.ObjectId>,
  IProductModel,
  IProductMethods
>(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 600,
      required: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 150,
      required: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },

    // Improved discount structure
    discount: {
      isActive: { type: Boolean, default: false },
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: {
        type: Number,
        min: 0,
        validate: {
          validator: function (this: mongoose.Document & IProduct, v: number) {
            if (this.discount?.isActive && (v === null || v === undefined)) {
              return false;
            }
            return true;
          },
          message: "Discount value is required when discount is active",
        },
      },
      startDate: { type: Date },
      endDate: { type: Date },
      maxDiscountAmount: { type: Number }, // For percentage discounts
    },

    // Define what variant types exist (Size, Color, etc.)
    variantDefinitions: [VariantDefinitionSchema],

    // All possible combinations with their specific data
    variants: {
      type: [VariantCombinationSchema],
      required: true,
      validate: {
        validator: (variants: IVariantCombination[]) => {
          return Array.isArray(variants) && variants.length > 0;
        },
        message: "Product must have at least one variant.",
      },
    },
    // IMAGES - Hybrid Approach
    // Base product images (shown when no variant selected)
    baseImage: { type: String },
    videos: [
      {
        url: String,
        title: String,
        thumbnail: String,
      },
    ],
    // Denormalized data (optional performance boost)
    brandName: { type: String },
    vendorName: { type: String },

    // Categories and Organization
    categoryPath: { type: String, required: true }, // e.g. "electronics/phones/smartphones"
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
    },
    // brand: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Brand",
    //   required: false,
    // },
    // Vendor/Supplier (for multi-vendor platforms)
    // vendor: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Vendor",
    // },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // Digital Products
    isDigital: { type: Boolean, default: false },
    digitalFile: {
      url: { type: String },
      fileType: { type: String }, // e.g., "pdf", "mp3"
      fileSize: { type: Number }, // bytes
    },

    // Tax
    isTaxable: { type: Boolean, default: true },
    taxClass: {
      type: String,
      enum: ["standard", "reduced", "none"],
      default: "standard",
    },

    // Metafields for extensibility
    // metafields: [
    //   {
    //     key: { type: String, required: true },
    //     value: { type: Schema.Types.Mixed },
    //     namespace: { type: String, default: "global" },
    //     required: false,
    //   },
    // ],

    // Physical Properties
    dimensions: ProductDimensionsSchema,
    // Unit Pricing
    unitPrice: {
      amount: { type: Number },
      unit: { type: String }, // e.g. "kg", "100ml", etc.
    },

    // Shipping
    // shipping: {
    //   weight: { type: Number },
    //   requiresShipping: { type: Boolean, default: false },
    //   shippingClass: {
    //     type: String,
    //     enum: ["standard", "express", "overnight", "free"],
    //   },
    //   freeShippingThreshold: { type: Number },
    // },

    // Product Status
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
    },
    isVisible: { type: Boolean, default: true },

    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },

    // Reviews and Ratings
    reviews: {
      type: ProductReviewsSchema,
      default: () => ({}),
    },

    // SEO
    seo: ProductSEOSchema,

    // Additional Product Information
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
        category: { type: String, enum: ["technical", "physical", "features"] },
        order: { type: Number, required: true },
      },
    ],

    // Sales Analytics
    analytics: {
      viewCount: { type: Number, default: 0 },
      purchaseCount: { type: Number, default: 0 },
      wishlistCount: { type: Number, default: 0 },
      lastPurchased: { type: Date },
      popularity: { type: Number, default: 0 },
    },

    // Related Products
    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    crossSellProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Admin fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.method(
  "updatePopularity",
  async function updatePopularity(): Promise<ProductDocument> {
    // Simple popularity calculation - you can make this more sophisticated
    this.analytics.popularity =
      this.analytics.viewCount * 0.1 +
      this.analytics.purchaseCount * 2 +
      this.analytics.wishlistCount * 0.5 +
      (!this.reviews ? 0 : this.reviews.averageRating * 10);

    return this.save();
  }
);

ProductSchema.method(
  "addView",
  async function addView(): Promise<ProductDocument> {
    this.analytics.viewCount += 1;
    return this.updatePopularity();
  }
);

// Find variant by options
ProductSchema.method(
  "findVariant",
  function findVariant(options: IVariantOption[]) {
    return this.variants.find((variant: IVariantCombination) => {
      if (variant.options.length !== options.length) return false;

      return variant.options.every((vo) =>
        options.some((o) => o.name === vo.name && o.value === vo.value)
      );
    });
  }
);

// Get available options for a specific variant type
ProductSchema.method(
  "getAvailableOptions",
  function getAvailableOptions(variantName: string) {
    const availableVariants = this.variants?.filter(
      (v: IVariantCombination) => v.isActive && v.stock > 0
    );

    if (!availableVariants) return undefined;

    const options = new Set<string>();
    availableVariants?.forEach((variant: IVariantCombination) => {
      const option = variant.options.find((o) => o.name === variantName);
      if (option) options.add(option.value);
    });

    return Array.from(options);
  }
);

// Check if specific combination is available
ProductSchema.method(
  "isVariantAvailable",
  function isVariantAvailable(options: IVariantOption[]) {
    const variant = this.findVariant(options);
    return variant && variant.isActive && variant.stock > 0;
  }
);

// Static methods
ProductSchema.static(
  "getLowStockProducts",
  function getLowStockProducts(threshold?: number): Promise<ProductDocument[]> {
    return this.aggregate([
      // Stage 1: Deconstruct the variants array
      { $unwind: "$variants" },
      // Stage 2: Match active products with active, tracked variants that are low on stock
      {
        $match: {
          status: "active",
          "variants.isActive": true,
          "variants.trackQuantity": true,
          $expr: {
            $and: [
              { $gt: ["$variants.stock", 0] },
              {
                $lte: [
                  "$variants.stock",
                  threshold || "$variants.lowStockThreshold",
                ],
              },
            ],
          },
        },
      },
      // Stage 3: Group back to unique products to avoid duplicates
      { $group: { _id: "$_id" } },
      // Stage 4: Lookup the full product document
      {
        $lookup: {
          from: "products", // The name of your collection
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $replaceRoot: { newRoot: { $arrayElemAt: ["$product", 0] } } },
    ]);
    // const query = {
    //   status: "active",
    //   // availability: "in_stock",
    //   "inventory.trackQuantity": true,
    //   $expr: {
    //     $and: [
    //       { $gt: ["$inventory.stock", 0] },
    //       {
    //         $lte: [
    //           "$inventory.stock",
    //           threshold || "$inventory.lowStockThreshold",
    //         ],
    //       },
    //     ],
    //   },
    // };

    // return this.find(query).sort({ "inventory.stock": 1 }); // Lowest stock first
  }
);

// Static methods for different stock scenarios

ProductSchema.static(
  "getOutOfStockProducts",
  function getOutOfStockProducts(): Promise<ProductDocument[]> {
    // return this.find({
    //   status: "active",
    //   // availability: "out_of_stock",
    //   "inventory.stock": 0,
    // });
    return this.aggregate([
      { $match: { status: "active" } },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $size: "$variants",
              },
              {
                $size: {
                  $filter: {
                    input: "$variants",
                    as: "variant",
                    cond: {
                      $or: [
                        { $eq: ["$$variant.isActive", false] },
                        { $eq: ["$$variant.stock", 0] },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ]);
  }
);

ProductSchema.static(
  "getCriticalStockProducts",
  function getCriticalStockProducts(): Promise<ProductDocument[]> {
    return this.find({
      status: "active",
      "inventory.trackQuantity": true,
      $expr: {
        $lte: [
          "$inventory.stock",
          { $multiply: ["$inventory.lowStockThreshold", 0.5] },
        ],
      },
    }); // Products with stock ≤ 50% of threshold (critical)
  }
);

ProductSchema.static(
  "getStockReport",
  async function getStockReport(): Promise<{
    lowStock: number;
    outOfStock: number;
    critical: number;
    products: {
      lowStock: ProductDocument[];
      outOfStock: ProductDocument[];
      critical: ProductDocument[];
    };
  }> {
    const [lowStock, outOfStock, critical] = await Promise.all([
      this.getLowStockProducts(),
      this.getOutOfStockProducts(),
      this.getCriticalStockProducts(),
    ]);

    return {
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      critical: critical.length,
      products: {
        lowStock,
        outOfStock,
        critical,
      },
    };
  }
);

// Virtual fields
ProductSchema.virtual("discountedPrice").get(function () {
  if (!this.discount?.isActive || !this.discount?.value) {
    return this.price;
  }

  if (this.discount.type === "percentage") {
    const discountAmount = (this.price * this.discount.value) / 100;
    const maxDiscount = this.discount.maxDiscountAmount || discountAmount;
    return this.price - Math.min(discountAmount, maxDiscount);
  } else {
    return Math.max(0, this.price - this.discount.value);
  }
});

ProductSchema.virtual("discountAmount").get(function () {
  return this.price - this.get("discountedPrice");
});

ProductSchema.virtual("discountPercentage").get(function () {
  if (this.price === 0) return 0;
  return Math.round(
    ((this.price - this.get("discountedPrice")) / this.price) * 100
  );
});

ProductSchema.virtual("isInStock").get(function () {
  return this.variants.some((variant) => {
    return variant.stock > 0 || variant.allowBackorder;
  });
});

ProductSchema.virtual("hasVariants").get(function () {
  return this.variants.length > 1;
});

ProductSchema.virtual("isLowStock").get(function () {
  // if (!this.inventory) return false;
  this.variants.some((variant) => {
    if (!variant.trackQuantity) return false;
    return variant.stock <= variant.lowStockThreshold && variant.stock > 0;
  });
});

// Virtual to get recent reviews with full data
ProductSchema.virtual("recentReviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  options: {
    sort: { createdAt: -1 },
    limit: 5,
    match: { status: "approved" },
  },
});
// Virtual to determine if product can be purchased
// ProductSchema.virtual("canPurchase").get(function () {
//   if (this.status !== "active") return false;

//   return ["in_stock", "preorder", "backorder"].includes(this.availability);
// });

// Virtual to get display status for customers
// ProductSchema.virtual("displayStatus").get(function () {
//   if (this.status !== "active") return null; // Don't show inactive products
//   if (!this.inventory) return null;
//   switch (this.availability) {
//     case "in_stock":
//       return this.inventory.stock > 0 ? "Available" : "Out of Stock";
//     case "out_of_stock":
//       return this.inventory.restockDate
//         ? `Back in stock ${this.inventory.restockDate.toDateString()}`
//         : "Currently unavailable";
//     case "preorder":
//       return this.inventory.preorderDate
//         ? `Pre-order (Ships ${this.inventory.preorderDate.toDateString()})`
//         : "Available for pre-order";
//     case "backorder":
//       return "Available on backorder";
//     case "discontinued":
//       return "No longer available";
//     default:
//       return "Check availability";
//   }
// });

// Get total stock across all variants
ProductSchema.virtual("totalStock").get(function () {
  // Sums the stock of all active variants
  return this.variants.reduce((total, variant) => {
    return total + (variant.isActive ? variant.stock : 0);
  }, 0);
});

// Get price range for variants
ProductSchema.virtual("priceRange").get(function () {
  const activePrices = this.variants
    ?.filter((v) => v.isActive)
    .map((v) => v.price);

  if (!activePrices || activePrices.length === 0) {
    return { min: this.price, max: this.price };
  }
  return {
    min: Math.min(...activePrices),
    max: Math.max(...activePrices),
  };
});

// Get default variant
ProductSchema.virtual("defaultVariant").get(function () {
  return (
    this.variants?.find((v) => v.isDefault && v.isActive) ||
    this.variants?.find((v) => v.isActive)
  );
});

// Get all images (base + variant images)
ProductSchema.virtual("allImages").get(function () {
  const base = this.baseImage || [];
  const variantImages = this.variants?.reduce(
    (acc: { url: string; alt: string }[], variant) => {
      if (variant.images && variant.images.length > 0) {
        acc.push(
          ...variant.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            order: image.order,
            isPrimary: image.isPrimary,
          }))
        );
      }
      return acc;
    },
    []
  );

  if (!variantImages) return [base];

  return [base, ...variantImages];
});

// Indexes for better performance
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ price: 1 });
ProductSchema.index({ "reviews.averageRating": -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ "analytics.popularity": -1 });
ProductSchema.index({ status: 1, "analytics.popularity": -1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ "variants.stock": 1 });

const Product =
  (models.Product as IProductModel) ??
  model<IProduct, IProductModel>("Product", ProductSchema);
export default Product;
