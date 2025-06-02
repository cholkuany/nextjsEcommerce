import ProductDetails from "./productDetails";
import { ProductDetailsSkeleton } from "@/components/ui/skeletons";
import { Suspense } from "react";

import type { Metadata } from "next";
import { fetchProductById, fetchProductsByCategory } from "@/app/lib/data";

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
      images: product.images,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);
  const relatedProducts = await fetchProductsByCategory(
    product.category.slug,
    product.name
  );

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}
