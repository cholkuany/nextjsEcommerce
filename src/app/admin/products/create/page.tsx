import Category from "@/models/category";
import dbConnect from "@/app/lib/mongodbConnection";
import { CreateProductForm } from "@/components/forms/createProductForm";
import { fetchCategories } from "@/app/lib/data";
import { CategoryDocument } from "@/models/category";

export default async function Create() {
  const categories = await fetchCategories();
  return <CreateProductForm categories={categories} />;
}
