import mongoose, {
  Schema,
  Document,
  model,
  CallbackError,
} from "mongoose";
import { IProduct } from "./product";

export interface ICategoryImage {
  url: string;
  alt: string;
}

const CategoryImageSchema = new Schema<ICategoryImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
});

// models/Category.model.ts

export interface ICategory {
  name: string;
  slug: string;
  parent: mongoose.Types.ObjectId | null; // Self-referencing parent
  ancestors: { _id: mongoose.Types.ObjectId; name: string; slug: string }[];
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
      default: null,
    },

    ancestors: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
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
      index: true,
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
CategorySchema.index({ name: "text", description: "text" });

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

CategorySchema.post("save", async function (doc, next) {
  // Update categoryPath for all products in this category (and descendants)
  const descendants = await mongoose
    .model<ICategory & Document>("Category")
    .find({
      $or: [{ _id: doc._id }, { "ancestors._id": doc._id }],
    })
    .select("_id slug ancestors");

  const Product = mongoose.model("Product");

  for (const category of descendants) {
    const names = [
      ...(category.ancestors?.map((a) => a.name) || []),
      category.name,
    ];
    const newPath = names.join("/");

    await Product.updateMany(
      { category: category._id },
      { $set: { categoryPath: newPath } }
    );
  }

  next();
});

// Recursive helper to walk all descendants and collect updates
async function collectDescendantUpdates(
  categoryId: mongoose.Types.ObjectId,
  Category: mongoose.Model<ICategory>,
  Product: mongoose.Model<IProduct>,
  categoryBulkOps: mongoose.AnyBulkWriteOperation<ICategory>[],
  productBulkOps: mongoose.AnyBulkWriteOperation<IProduct>[]
): Promise<void> {
  const descendants = await Category.find({ parent: categoryId }).lean();

  for (const descendant of descendants) {
    // Rebuild new ancestors from parent
    const parent = await Category.findById(descendant.parent).lean();
    if (!parent) continue;

    const newAncestors = [
      ...(parent.ancestors || []),
      { _id: parent._id, name: parent.name, slug: parent.slug },
    ];

    // Update descendant category ancestors
    categoryBulkOps.push({
      updateOne: {
        filter: { _id: descendant._id },
        update: { $set: { ancestors: newAncestors } },
      },
    });

    // Update products under this descendant
    const names = [...newAncestors.map((a) => a.name), descendant.name];
    const newPath = names.join("/");

    productBulkOps.push({
      updateMany: {
        filter: { category: descendant._id },
        update: { $set: { categoryPath: newPath } },
      },
    });

    // Recursive: dive deeper into this child
    await collectDescendantUpdates(
      descendant._id,
      Category,
      Product,
      categoryBulkOps,
      productBulkOps
    );
  }
}

CategorySchema.post(
  "save",
  async function (
    doc: mongoose.HydratedDocument<ICategory>,
    next: (err?: CallbackError) => void
  ) {
    try {
      const Category = mongoose.model<ICategory>("Category");
      const Product = mongoose.model<IProduct>("Product");

      const categoryBulkOps: mongoose.AnyBulkWriteOperation<ICategory>[] = [];
      const productBulkOps: mongoose.AnyBulkWriteOperation<IProduct>[] = [];

      // ✅ Update products directly under the current category
      const docNames = [...(doc.ancestors?.map((a) => a.name) || []), doc.name];
      const docPath = docNames.join("/");

      productBulkOps.push({
        updateMany: {
          filter: { category: doc._id },
          update: { $set: { categoryPath: docPath } },
        },
      });

      // ✅ Walk recursively for all descendants
      await collectDescendantUpdates(
        doc._id,
        Category,
        Product,
        categoryBulkOps,
        productBulkOps
      );

      // ✅ Execute bulk ops in one go
      if (categoryBulkOps.length > 0) {
        await Category.bulkWrite(categoryBulkOps);
      }
      if (productBulkOps.length > 0) {
        await Product.bulkWrite(productBulkOps);
      }

      next();
    } catch (err) {
      next(err as CallbackError);
    }
  }
);

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
