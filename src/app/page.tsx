import ProductGallery from "@/components/productGallery"; // new client component

import {
  fetchCategories,
  fetchProducts,
  groupProductsByCategory,
} from "@/app/lib/data";
import DepartmentCarousel from "@/components/categories"; // new client component

export default async function Home() {
  const products = await fetchProducts();
  const categories = await fetchCategories();
  const productsByCategories = await groupProductsByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      <DepartmentCarousel products={productsByCategories} />
      <ProductGallery products={products} categories={categories} />
    </div>
  );
}
