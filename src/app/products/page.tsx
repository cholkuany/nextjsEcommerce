// import dbConnect from "@/app/lib/mongodbConnection";
// import Product from "@/models/product";
// import Link from "next/link";

// import { PopulatedProduct } from "@/types";

// export const dynamic = "force-dynamic";

// export default async function ProductsPage() {
//   await dbConnect();
//   const products: PopulatedProduct[] = await Product.find().populate(
//     "category"
//   );

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//       {products.map((product) => (
//         <Link key={product.name} href={`/products/${product.slug}`}>
//           <div className="border p-4 rounded shadow hover:shadow-lg transition">
//             <img
//               src={product.images?.[0]}
//               className="w-full h-40 object-cover"
//             />
//             <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
//             <p>${product.price}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }
