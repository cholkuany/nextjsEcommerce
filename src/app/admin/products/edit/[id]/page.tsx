import { EditProductForm } from "@/components/forms/editProductForm";
import { fetchCategories, fetchProductById } from "@/app/lib/data";

export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [product, categories] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
  ]);

  return <EditProductForm product={product} categories={categories} />;
}
