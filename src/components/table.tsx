import Image from "next/image";
import { ProductType } from "@/types";
import { EditProduct, DeleteProduct } from "./buttons";

export function ProductsTable({ products }: { products: ProductType[] }) {
  return (
    <div className="mt-6">
      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <table className="text-sm min-w-full text-gray-900">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr className="">
              <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
              <th className="px-3 py-5 font-medium">Price</th>
              <th className="px-3 py-5 font-medium">Stock</th>
              <th className="px-3 py-5 font-medium">Category</th>
              <th className="px-3 py-5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {products.map((product: ProductType) => (
              <tr
                key={product.id}
                className="w-full border-b-2 border-b-gray-50 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images[0]}
                      className="rounded-md object-cover"
                      width={28}
                      height={28}
                      alt={`${product.name}'s profile picture`}
                    />
                    <p>{product.name}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  ${product.price}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.inStock}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.category.name}
                </td>
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex justify-end gap-3">
                    <EditProduct id={product.id} />
                    <DeleteProduct id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
