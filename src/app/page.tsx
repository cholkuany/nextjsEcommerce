
import ProductGallery from "@/components/productGallery";
import { fetchProducts } from "@/app/lib/data";
import { TProduct } from "@/types";

export default async function Home() {
  const products: TProduct[] = await fetchProducts();

  console.log('product', products[0])

  return (
    <div className="flex flex-col min-h-screen">
      <section className="mx-auto w-full">
        <ProductGallery products={products} />
      </section>
    </div>
  );
}
