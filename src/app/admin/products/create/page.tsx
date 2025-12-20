import { CreateProductForm } from "@/components/forms/createProductForm";
import { fetchCategories } from "@/app/lib/data";

export default async function Create() {
  const categories = await fetchCategories();
  return <CreateProductForm categories={categories} />;
}
