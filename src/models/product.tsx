// // models/Product.ts
// // import mongoose, { Schema, Document, models, model } from "mongoose";

// // const ProductSchema = new Schema(
// //   {
// //     name: { type: String, required: true },
// //     slug: { type: String, required: true, unique: true },
// //     description: String,
// //     price: { type: Number, required: true },
// //     discount: {
// //       amount: {
// //         type: Number,
// //         required: false,
// //         min: 0,
// //       },
// //       percentage: {
// //         type: Number,
// //         required: false,
// //         min: 0,
// //         max: 100,
// //       },
// //     },
// //     images: [{ type: String, required: true }],
// //     inStock: { type: Number, default: 0 },

// //     // category: {
// //     //   type: Schema.Types.ObjectId,
// //     //   ref: "Category",
// //     //   required: true,
// //     // },
// //     subcategory: {
// //       type: Schema.Types.ObjectId,
// //       ref: "Subcategory",
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;

// // const Product =
// //   models.Product || model<ProductDocument>("Product", ProductSchema);

// // export default Product;

// // NEW SCHEMA
// // models/Product.ts
// import mongoose, { Schema, Document, models, model, Model } from "mongoose";

// // Define interfaces for better type safety
// export interface IVariantOption {
//   name: string; // "Size", "Color", "Material"
//   value: string; // "Large", "Red", "Cotton"
// }
// export interface IVariantCombination {
//   options: IVariantOption[];
//   sku: string;
//   price?: number;
//   compareAtPrice?: number;
//   stock: number;
//   barcode?: string;
//   weight?: number;
//   images?: string[];
//   isDefault?: boolean;
//   isActive?: boolean;
// }

// export interface IVariantDefinition {
//   name: string; // "Size", "Color", etc.
//   values: string[]; // ["Small", "Medium", "Large"]
//   required?: boolean;
//   displayType?: "dropdown" | "swatch" | "button" | "image";
// }

// const VariantOptionSchema = new Schema<IVariantOption>({
//   name: { type: String, required: true },
//   value: { type: String, required: true },
// });

// export interface IProductImage {
//   url: string;
//   alt: string;
//   isPrimary: boolean;
//   order: number;
// }

// export interface IProductDimensions {
//   length: number;
//   width: number;
//   height: number;
//   weight: number;
//   unit: "cm" | "in";
//   weightUnit: "kg" | "lb";
// }

// export interface IProductSEO {
//   metaTitle?: string;
//   metaDescription?: string;
//   keywords: string[];
// }

// export interface IProductReviews {
//   averageRating: number;
//   totalReviews: number;
//   ratingDistribution: {
//     5: number;
//     4: number;
//     3: number;
//     2: number;
//     1: number;
//   };
// }
// export interface IProductMethods {
//   updatePopularity(): Promise<ProductDocument>;
//   addView(): Promise<ProductDocument>;
// }

// export const ProductImageSchema = new Schema<IProductImage>({
//   url: { type: String, required: true },
//   alt: { type: String, required: true },
//   isPrimary: { type: Boolean, default: false },
//   order: { type: Number, default: 0 },
// });

// export const VariantCombinationSchema = new Schema<IVariantCombination>({
//   options: {
//     type: [VariantOptionSchema],
//     required: true,
//     validate: {
//       validator: function (options: IVariantOption[]) {
//         return options.length > 0;
//       },
//       message: "A variant must have at least one option",
//     },
//   }, // Array of variant options
//   sku: {
//     type: String,
//     required: true,
//     unique: true,
//     uppercase: true,
//     trim: true,
//   }, // Unique SKU for this combination
//   price: { type: Number, required: true, min: 0 },
//   stock: { type: Number, required: true, min: 0, default: 0 },
//   barcode: { type: String, sparse: true, unique: true }, // Allows multiple null values
//   compareAtPrice: { type: Number }, // Original price if on sale
//   weight: { type: Number, default: 0 }, // Weight for shipping calculations
//   images: [{ type: String }], // Specific images for this variant
//   isDefault: { type: Boolean, default: false }, // Default variant to show
//   isActive: { type: Boolean, default: true }, // Can be temporarily disabled
// });

// export const VariantDefinitionSchema = new Schema<IVariantDefinition>({
//   name: { type: String, required: true },
//   values: [{ type: String, required: true }],
//   required: { type: Boolean, default: false },
//   displayType: {
//     type: String,
//     enum: ["dropdown", "swatch", "button", "image"],
//     default: "dropdown",
//   },
// });

// export const ProductDimensionsSchema = new Schema<IProductDimensions>({
//   length: { type: Number, required: true },
//   width: { type: Number, required: true },
//   height: { type: Number, required: true },
//   weight: { type: Number, required: true },
//   unit: { type: String, enum: ["cm", "in"], default: "cm" },
//   weightUnit: { type: String, enum: ["kg", "lb"], default: "kg" },
// });

// export const ProductSEOSchema = new Schema<IProductSEO>({
//   metaTitle: { type: String, maxlength: 60 },
//   metaDescription: { type: String, maxlength: 160 },
//   keywords: [{ type: String, lowercase: true, trim: true, maxlength: 50 }],
// });

// export const ProductReviewsSchema = new Schema<IProductReviews>({
//   averageRating: {
//     type: Number,
//     default: null,
//     min: 0,
//     max: 5,
//     set: (val: number | null) => {
//       if (val === null || val === undefined) return null;
//       return Math.round(val * 10) / 10;
//     },
//   },
//   totalReviews: { type: Number, default: 0, min: 0 },
//   ratingDistribution: {
//     5: { type: Number, default: 0 },
//     4: { type: Number, default: 0 },
//     3: { type: Number, default: 0 },
//     2: { type: Number, default: 0 },
//     1: { type: Number, default: 0 },
//   },
// });

// const ProductSchema = new Schema(
//   {
//     // Basic Information
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 200,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 2000,
//     },
//     shortDescription: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//     },

//     // Pricing
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     originalPrice: {
//       type: Number,
//       min: 0,
//     },
//     costPrice: {
//       type: Number,
//       min: 0,
//     },

//     // Improved discount structure
//     discount: {
//       isActive: { type: Boolean, default: false },
//       type: {
//         type: String,
//         enum: ["percentage", "fixed"],
//         default: "percentage",
//       },
//       value: {
//         type: Number,
//         min: 0,
//       },
//       startDate: { type: Date },
//       endDate: { type: Date },
//       maxDiscountAmount: { type: Number }, // For percentage discounts
//     },

//     // VARIANT STRUCTURE
//     hasVariants: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     // Define what variant types exist (Size, Color, etc.)
//     variantDefinitions: [VariantDefinitionSchema],

//     // All possible combinations with their specific data
//     variants: [VariantCombinationSchema],

//     // Inventory Management - Fallback for products without variants
//     inventory: {
//       stock: { type: Number, default: 0, min: 0 },
//       lowStockThreshold: { type: Number, default: 10 },
//       trackQuantity: { type: Boolean, default: true },
//       allowBackorder: { type: Boolean, default: false },
//       preorderDate: { type: Date }, // When preorder becomes available
//       discontinuedDate: { type: Date }, // When product was discontinued
//       restockDate: { type: Date }, // Expected restock date
//       sku: {
//         type: String,
//         unique: true,
//         sparse: true, // Allows multiple null values
//       },
//       barcode: { type: String },
//     },

//     // Media

//     // IMAGES - Hybrid Approach
//     // Base product images (shown when no variant selected)
//     baseImages: {
//       type: [ProductImageSchema],
//       validate: {
//         validator: function (images: IProductImage[]) {
//           return images.length > 0;
//         },
//         message: "At least one image is required",
//       },
//     },
//     videos: [
//       {
//         url: String,
//         title: String,
//         thumbnail: String,
//       },
//     ],

//     // Categories and Organization
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//       index: true,
//     },
//     subcategory: {
//       type: Schema.Types.ObjectId,
//       ref: "Subcategory",
//       required: true,
//       index: true,
//     },
//     brand: {
//       type: Schema.Types.ObjectId,
//       ref: "Brand",
//     },
//     tags: [
//       {
//         type: String,
//         lowercase: true,
//         trim: true,
//       },
//     ],

//     // Digital Products
//     isDigital: { type: Boolean, default: false },
//     digitalFile: {
//       url: { type: String },
//       fileType: { type: String }, // e.g., "pdf", "mp3"
//       fileSize: { type: Number }, // bytes
//     },

//     // Preorder / Availability
//     isPreorder: { type: Boolean, default: false },
//     availableFrom: { type: Date },

//     // Tax
//     isTaxable: { type: Boolean, default: true },
//     taxClass: {
//       type: String,
//       enum: ["standard", "reduced", "none"],
//       default: "standard",
//     },

//     // Denormalized data (optional performance boost)
//     categoryName: { type: String },
//     subcategoryName: { type: String },
//     brandName: { type: String },

//     // Metafields for extensibility
//     metafields: [
//       {
//         key: { type: String, required: true },
//         value: { type: Schema.Types.Mixed },
//         namespace: { type: String, default: "global" },
//       },
//     ],

//     // Physical Properties
//     dimensions: ProductDimensionsSchema,
//     // Unit Pricing
//     unitPrice: {
//       amount: { type: Number },
//       unit: { type: String }, // e.g. "kg", "100ml", etc.
//     },

//     // Shipping
//     shipping: {
//       weight: { type: Number },
//       requiresShipping: { type: Boolean, default: true },
//       shippingClass: {
//         type: String,
//         enum: ["standard", "express", "overnight", "free"],
//       },
//       freeShippingThreshold: { type: Number },
//     },

//     // Product Status
//     status: {
//       type: String,
//       enum: ["draft", "active", "inactive", "archived"],
//       default: "draft",
//       index: true,
//     },
//     isVisible: { type: Boolean, default: true }, // for frontend visibility
//     availability: {
//       type: String,
//       enum: [
//         "in_stock",
//         "out_of_stock",
//         "preorder",
//         "discontinued",
//         "backorder",
//       ],
//       default: "in_stock",
//     },

//     isFeatured: { type: Boolean, default: false, index: true },
//     isBestseller: { type: Boolean, default: false },
//     isNewArrival: { type: Boolean, default: false },

//     // Reviews and Ratings
//     reviews: {
//       type: ProductReviewsSchema,
//       default: () => ({}),
//     },

//     // SEO
//     seo: ProductSEOSchema,

//     // Additional Product Information
//     specifications: [
//       {
//         name: { type: String, required: true },
//         value: { type: String, required: true },
//       },
//     ],

//     // Sales Analytics
//     analytics: {
//       viewCount: { type: Number, default: 0 },
//       purchaseCount: { type: Number, default: 0 },
//       wishlistCount: { type: Number, default: 0 },
//       lastPurchased: { type: Date },
//       popularity: { type: Number, default: 0 }, // Can be calculated based on views, purchases, etc.
//     },

//     // Related Products
//     relatedProducts: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//     crossSellProducts: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],

//     // Vendor/Supplier (for multi-vendor platforms)
//     vendor: {
//       type: Schema.Types.ObjectId,
//       ref: "Vendor",
//     },

//     // Admin fields
//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//     lastModifiedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },

//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Virtual fields
// ProductSchema.virtual("discountedPrice").get(function () {
//   if (!this.discount?.isActive || !this.discount?.value) {
//     return this.price;
//   }

//   if (this.discount.type === "percentage") {
//     const discountAmount = (this.price * this.discount.value) / 100;
//     const maxDiscount = this.discount.maxDiscountAmount || discountAmount;
//     return this.price - Math.min(discountAmount, maxDiscount);
//   } else {
//     return Math.max(0, this.price - this.discount.value);
//   }
// });

// ProductSchema.virtual("discountAmount").get(function () {
//   return this.price - this.get("discountedPrice");
// });

// ProductSchema.virtual("discountPercentage").get(function () {
//   if (this.price === 0) return 0;
//   return Math.round(
//     ((this.price - this.get("discountedPrice")) / this.price) * 100
//   );
// });

// ProductSchema.virtual("isInStock").get(function () {
//   if (!this.inventory) return false;

//   return this.inventory.stock > 0 || this.inventory.allowBackorder;
// });

// ProductSchema.virtual("isLowStock").get(function () {
//   if (!this.inventory) return false;
//   return (
//     this.inventory.stock <= this.inventory.lowStockThreshold &&
//     this.inventory.stock > 0
//   );
// });

// ProductSchema.virtual("primaryImage").get(function () {
//   return this.baseImages.find((img) => img.isPrimary) || this.baseImages[0];
// });
// // Virtual to get recent reviews with full data
// ProductSchema.virtual("recentReviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product",
//   options: {
//     sort: { createdAt: -1 },
//     limit: 5,
//     match: { status: "approved" },
//   },
// });
// // Virtual to determine if product can be purchased
// ProductSchema.virtual("canPurchase").get(function () {
//   if (this.status !== "active") return false;

//   return ["in_stock", "preorder", "backorder"].includes(this.availability);
// });

// // Virtual to get display status for customers
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

// // Get total stock across all variants
// ProductSchema.virtual("totalStock").get(function () {
//   if (!this.hasVariants) {
//     if (!this.inventory) return 0;
//     return this.inventory.stock;
//   }

//   return this.variants.reduce((total, variant) => {
//     return total + (variant.isActive ? variant.stock : 0);
//   }, 0);
// });

// // Get price range for variants
// ProductSchema.virtual("priceRange").get(function () {
//   if (!this.hasVariants) {
//     return { min: this.price, max: this.price };
//   }

//   const activePrices = this.variants
//     .filter((v) => v.isActive)
//     .map((v) => v.price || this.price);

//   return {
//     min: Math.min(...activePrices),
//     max: Math.max(...activePrices),
//   };
// });

// // Get default variant
// ProductSchema.virtual("defaultVariant").get(function () {
//   if (!this.hasVariants) return null;

//   return (
//     this.variants.find((v) => v.isDefault && v.isActive) ||
//     this.variants.find((v) => v.isActive)
//   );
// });

// // Get all images (base + variant images)
// ProductSchema.virtual("allImages").get(function () {
//   const base = this.baseImages || [];
//   const variantImages = this.variants.reduce(
//     (acc: { url: string; alt: string }[], variant) => {
//       if (variant.images && variant.images.length > 0) {
//         acc.push(
//           ...variant.images.map((url) => ({ url, alt: `${variant.sku} image` }))
//         );
//       }
//       return acc;
//     },
//     []
//   );

//   return [...base, ...variantImages];
// });

// // Indexes for better performance
// ProductSchema.index({ name: "text", description: "text", tags: "text" });
// ProductSchema.index({ price: 1 });
// ProductSchema.index({ "reviews.averageRating": -1 });
// ProductSchema.index({ createdAt: -1 });
// ProductSchema.index({ "analytics.popularity": -1 });
// ProductSchema.index({ status: 1, "analytics.popularity": -1 });
// ProductSchema.index({ category: 1, subcategory: 1 });
// ProductSchema.index({ status: 1, isFeatured: 1 });

// // Pre-save middleware
// ProductSchema.pre("save", function (next) {
//   // Ensure only one primary image
//   const primaryImages = this.baseImages.filter((img) => img.isPrimary);
//   if (primaryImages.length === 0 && this.baseImages.length > 0) {
//     this.baseImages[0].isPrimary = true;
//   } else if (primaryImages.length > 1) {
//     this.baseImages.forEach((img, index) => {
//       img.isPrimary = index === 0;
//     });
//   }

//   // Set originalPrice if not provided but discount exists
//   if (this.discount?.isActive && !this.originalPrice) {
//     this.originalPrice = this.price;
//   }

//   next();
// });

// // Pre-save middleware to auto-update availability based on stock
// ProductSchema.pre("save", function (next) {
//   if (!this.inventory) return next();
//   if (this.inventory.trackQuantity) {
//     // Auto-update availability based on stock levels
//     if (this.inventory.stock <= 0 && this.availability === "in_stock") {
//       if (this.inventory.allowBackorder) {
//         this.availability = "backorder";
//       } else {
//         this.availability = "out_of_stock";
//       }
//     } else if (
//       this.inventory.stock > 0 &&
//       this.availability === "out_of_stock"
//     ) {
//       this.availability = "in_stock";
//     }
//   }

//   next();
// });

// // Methods
// ProductSchema.methods.updatePopularity =
//   async function (): Promise<ProductDocument> {
//     // Simple popularity calculation - you can make this more sophisticated
//     this.analytics.popularity =
//       this.analytics.viewCount * 0.1 +
//       this.analytics.purchaseCount * 2 +
//       this.analytics.wishlistCount * 0.5 +
//       this.reviews.averageRating * 10;

//     return this.save();
//   };

// ProductSchema.methods.addView = async function (): Promise<ProductDocument> {
//   this.analytics.viewCount += 1;
//   return this.updatePopularity();
// };

// // Find variant by options
// ProductSchema.methods.findVariant = function (options: IVariantOption[]) {
//   return this.variants.find((variant: IVariantCombination) => {
//     if (variant.options.length !== options.length) return false;

//     return variant.options.every((vo) =>
//       options.some((o) => o.name === vo.name && o.value === vo.value)
//     );
//   });
// };

// // Get available options for a specific variant type
// ProductSchema.methods.getAvailableOptions = function (variantName: string) {
//   const availableVariants = this.variants.filter(
//     (v: IVariantCombination) => v.isActive && v.stock > 0
//   );

//   const options = new Set();
//   availableVariants.forEach((variant: IVariantCombination) => {
//     const option = variant.options.find((o) => o.name === variantName);
//     if (option) options.add(option.value);
//   });

//   return Array.from(options);
// };

// // Check if specific combination is available
// ProductSchema.methods.isVariantAvailable = function (
//   options: IVariantOption[]
// ) {
//   const variant = this.findVariant(options);
//   return variant && variant.isActive && variant.stock > 0;
// };

// // export type IProductType = mongoose.InferSchemaType<typeof ProductSchema>;
// export type ProductDocument = mongoose.HydratedDocument<
//   mongoose.InferSchemaType<typeof ProductSchema>,
//   IProductMethods
// >;

// export interface ProductModel
//   extends Model<ProductDocument, {}, IProductMethods> {
//   getLowStockProducts(threshold?: number): Promise<ProductDocument[]>;
//   getOutOfStockProducts(): Promise<ProductDocument[]>;
//   getCriticalStockProducts(): Promise<ProductDocument[]>;
//   getStockReport(): Promise<{
//     lowStock: number;
//     outOfStock: number;
//     critical: number;
//     products: {
//       lowStock: ProductDocument[];
//       outOfStock: ProductDocument[];
//       critical: ProductDocument[];
//     };
//   }>;
// }

// // Static methods for different stock scenarios
// ProductSchema.statics.getLowStockProducts = function (
//   threshold?: number
// ): Promise<ProductDocument[]> {
//   const query: any = {
//     status: "active",
//     availability: "in_stock",
//     "inventory.trackQuantity": true,
//     $expr: {
//       $and: [
//         { $gt: ["$inventory.stock", 0] },
//         {
//           $lte: [
//             "$inventory.stock",
//             threshold || "$inventory.lowStockThreshold",
//           ],
//         },
//       ],
//     },
//   };

//   return this.find(query).sort({ "inventory.stock": 1 }); // Lowest stock first
// };

// ProductSchema.statics.getOutOfStockProducts = function (): Promise<
//   ProductDocument[]
// > {
//   return this.find({
//     status: "active",
//     availability: "out_of_stock",
//     "inventory.stock": 0,
//   });
// };

// ProductSchema.statics.getCriticalStockProducts = function (): Promise<
//   ProductDocument[]
// > {
//   return this.find({
//     status: "active",
//     "inventory.trackQuantity": true,
//     $expr: {
//       $lte: [
//         "$inventory.stock",
//         { $multiply: ["$inventory.lowStockThreshold", 0.5] },
//       ],
//     },
//   }); // Products with stock ≤ 50% of threshold (critical)
// };

// ProductSchema.statics.getStockReport = async function (): Promise<{
//   lowStock: number;
//   outOfStock: number;
//   critical: number;
//   products: {
//     lowStock: ProductDocument[];
//     outOfStock: ProductDocument[];
//     critical: ProductDocument[];
//   };
// }> {
//   const [lowStock, outOfStock, critical] = await Promise.all([
//     this.getLowStockProducts(),
//     this.getOutOfStockProducts(),
//     this.getCriticalStockProducts(),
//   ]);

//   return {
//     lowStock: lowStock.length,
//     outOfStock: outOfStock.length,
//     critical: critical.length,
//     products: {
//       lowStock,
//       outOfStock,
//       critical,
//     },
//   };
// };

// const Product =
//   (models.Product as ProductModel) ??
//   model<ProductDocument, ProductModel>("Product", ProductSchema);

// export default Product;
