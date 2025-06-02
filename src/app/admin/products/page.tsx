import Breadcrumbs from "@/components/breadcrumbs";
import Search from "@/components/search";
import { ProductsTable } from "@/components/table";
import { CreateProduct } from "@/components/buttons";
import { fetchProducts } from "@/app/lib/data";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: "dashboard", href: "/admin" },
            {
              label: "products",
              href: "/admin/products",
              active: true,
            },
          ]}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateProduct />
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
