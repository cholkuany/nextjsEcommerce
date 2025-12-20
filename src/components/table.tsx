import Image from "next/image";
import { TProduct } from "@/types";
import { EditProduct, DeleteProduct } from "./buttons";
import { fetchFilteredProducts } from "@/app/lib/data";

// export function ProductsTable({ products }: { products: ProductType[] }) {
//   return (
//     <div className="mt-6">
//       <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
//         <table className="text-sm min-w-full text-gray-900">
//           <thead className="rounded-lg text-left text-sm font-normal">
//             <tr className="">
//               <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
//               <th className="px-3 py-5 font-medium">Price</th>
//               <th className="px-3 py-5 font-medium">Stock</th>
//               <th className="px-3 py-5 font-medium">Category</th>
//               <th className="px-3 py-5 font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {products.map((product: ProductType) => (
//               <tr
//                 key={product.id}
//                 className="w-full border-b-2 border-b-gray-50 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
//               >
//                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
//                   <div className="flex items-center gap-3">
//                     <Image
//                       src={product.images[0]}
//                       className="rounded-md object-cover"
//                       width={28}
//                       height={28}
//                       alt={`${product.name}'s display image`}
//                     />
//                     <p>{product.name}</p>
//                   </div>
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-3">
//                   ${product.price}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-3">
//                   {product.inStock}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-3">
//                   {product.category.name}
//                 </td>
//                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
//                   <div className="flex justify-end gap-3">
//                     <EditProduct id={product.id} />
//                     <DeleteProduct id={product.id} />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

export async function ProductsTable({
  page,
  query,
}: {
  query: string;
  page: number;
}) {
  const products = await fetchFilteredProducts(query, page);
  return (
    <div className="grow mt-6 space-y-4 rounded-lg bg-gray-50 p-8">
      <div className="first:rounded-t-lg last:rounded-b-lg bg-white">
        {products.map((product: TProduct) => (
          <div
            key={product.id}
            className="first:border-0 border-t-[1px] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.baseImage}
                className="rounded-md object-cover"
                width={48}
                height={48}
                alt={`${product.name}'s display image`}
              />
              <div>
                <p className="text-base font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">{product.categoryPath}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-6 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Price:</span> ${product.price}
              </div>
              <div>
                <span className="font-semibold">Stock:</span>{" "}
                {product.variants[0].stock}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <EditProduct id={product.slug} />
              <DeleteProduct id={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
