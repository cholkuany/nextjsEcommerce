import Breadcrumbs from "@/components/breadcrumbs";
import Search from "@/components/search";
import { ProductsTable } from "@/components/table";
import { CreateProduct } from "@/components/buttons";
import { productsPages } from "@/app/lib/data";
import Pagination from "@/components/pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchTerms = (await searchParams) ?? {};
  const query = searchTerms.query || "";
  const page = Number(searchTerms.page) || 1;
  const totalPages = await productsPages(query);

  return (
    <div className="grid w-full">
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

      <div className="grow-0 mt-10 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateProduct />
      </div>

      {/* <ProductsTable products={products} /> */}
      <ProductsTable query={query} page={page} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
