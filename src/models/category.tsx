import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
// import { Schema, model, models, InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export type CategoryDocument = mongoose.InferSchemaType<typeof CategorySchema>;

const Category = models.Category || model("Category", CategorySchema);

export default Category;

const allCategories = [
  {
    name: "Health & Personal Care",
    subCategories: [
      "Vitamins & Supplements",
      "Skin Care",
      "Oral Care",
      "Pain Relief",
      "Feminine Hygiene",
    ],
  },

  {
    name: "Grocery",
    subCategories: [
      "Fresh Produce",
      "Meat & Seafood",
      "Snacks & Candy",
      "Pantry Staples",
      "Beverages",
      "Dairy & Eggs",
      "Frozen Foods",
    ],
  },

  {
    name: "Toys & Games",
    subCategories: [
      "Action Figures",
      "Board Games",
      "Puzzles",
      "Dolls & Plush",
      "Outdoor Play",
    ],
  },
  {
    name: "Clothing",
    subCategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids & Baby Clothing",
      "Shoes",
      "Accessories",
    ],
  },

  {
    name: "Household Essentials",
    subCategories: [
      "Cleaning Supplies",
      "Paper Products",
      "Laundry Care",
      "Air Fresheners",
    ],
  },

  {
    name: "Electronics",
    subCategories: [
      "Phones & Accessories",
      "Laptops & Tablets",
      "TV & Home Theater",
      "Headphones",
      "Cameras & Photography",
    ],
  },

  {
    name: "Home & Furniture",
    subCategories: [
      "Bedroom Furniture",
      "Living Room Furniture",
      "Kitchen & Dining",
      "Storage & Organization",
      "Bedding & Linens",
    ],
  },

  {
    name: "Kitchen & Dining",
    subCategories: [
      "Cookware",
      "Small Appliances",
      "Dinnerware",
      "Storage Containers",
    ],
  },

  {
    name: "Pets",
    subCategories: [
      "Dog Supplies",
      "Cat Supplies",
      "Pet Food",
      "Pet Toys",
      "Pet Grooming",
      "Pet Health",
      "Bird Supplies",
      "Fish Supplies",
      "Reptile Supplies",
    ],
  },

  {
    name: "Sports & Fitness",
    subCategories: ["Exercise Equipment", "Sports Gear", "Outdoor Recreation"],
  },

  {
    name: "Beauty",
    subCategories: ["Makeup", "Hair Care", "Fragrance", "Grooming Tools"],
  },

  {
    name: "Books & Media",
    subCategories: [
      "Fiction",
      "Non-fiction",
      "Children's Books",
      "Movies & TV",
      "Music",
    ],
  },

  {
    name: "🧰 Tools & Hardware",
    subCategories: [
      "Power Tools",
      "Hand Tools",
      "Paint & Supplies",
      "Home Improvement",
    ],
  },

  {
    name: "🌻 Garden & Outdoor",
    subCategories: [
      "Grills & Accessories",
      "Patio Furniture",
      "Lawn Care",
      "Outdoor Décor",
    ],
  },

  {
    name: "👶 Baby",
    subCategories: [
      "Diapers & Wipes",
      "Baby Gear",
      "Feeding",
      "Nursery Furniture",
    ],
  },
];
