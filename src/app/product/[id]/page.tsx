import ProductDetails from "./productDetails";
import { TProduct } from "@/types";

import type { Metadata } from "next";
import { fetchProductById, fetchProductsByCategory } from "@/app/lib/data";
import { Section } from "@/components/productGallery";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = await params;
  const product = await fetchProductById(id);

  return {
    title: product.name,
    alternates: {
      canonical: `/${decodeURIComponent(product.id)}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: "http://localhost:3000/",
      type: "website",
      images: [product.baseImage],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product: TProduct = await fetchProductById(id);

  const relatedProducts: TProduct[] = await fetchProductsByCategory(
    product.categoryPath,
    product.name
  );

  return (
    <section className="flex flex-col max-w-7xl mx-auto p-4 mt-24 md:mt-32">
      <ProductDetails key={product.id} product={product} />

      {/* related products */}
      {relatedProducts.length > 0 && (
        <Section title="Related Products" products={relatedProducts} />
      )}
    </section>
  );
}
