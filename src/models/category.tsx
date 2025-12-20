import mongoose, { Schema, model } from "mongoose";

export interface ICategoryImage {
  url: string;
  alt: string;
  // type: "thumbnail" | "banner" | "icon";
}

const CategoryImageSchema = new Schema<ICategoryImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  // type: {
  //   type: String,
  //   enum: ["thumbnail", "banner", "icon"],
  //   default: "thumbnail",
  // },
});

// models/Category.model.ts

export interface ICategory {
  name: string;
  slug: string;
  parent: mongoose.Types.ObjectId | null; // Self-referencing parent
  ancestors: { _id: mongoose.Types.ObjectId; name: string; slug: string }[]; // For easy breadcrumbs
  description?: string;
  images?: ICategoryImage[];
  createdBy?: mongoose.Types.ObjectId;
  lastModifiedBy?: mongoose.Types.ObjectId;
  status: "active" | "inactive" | "archived";
}

export const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null, // A null parent means it's a top-level category
    },
    // This is an optimization for performance. We store the path to the root.
    ancestors: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        name: String,
        slug: String,
      },
    ],

    description: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    // Enhanced media support
    images: {
      type: [CategoryImageSchema],
      default: [],
    },
    // Display and organization
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    // Admin
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Indexes
// CategorySchema.index({ slug: 1 });
// CategorySchema.index({ name: "text" });

// This is an advanced middleware to automatically update the ancestors path
CategorySchema.pre("save", async function (next) {
  if (this.isModified("parent")) {
    if (this.parent) {
      const parentCategory = await mongoose
        .model("Category")
        .findById(this.parent);
      if (parentCategory) {
        this.ancestors = [
          ...parentCategory.ancestors,
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug,
          },
        ];
      }
    } else {
      this.ancestors = [];
    }
  }
  next();
});

// Virtuals
CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

CategorySchema.virtual("primaryImage").get(function () {
  return this.images?.find((img) => img.url) || this.images?.[0];
});

const Category =
  mongoose.models.Category<ICategory> ||
  model<ICategory>("Category", CategorySchema);
export default Category;
