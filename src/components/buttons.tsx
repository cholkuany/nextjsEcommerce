import { MdOutlineEdit } from "react-icons/md";
import { GoTrash, GoPlus } from "react-icons/go";

import Link from "next/link";
import { deleteProduct } from "@/app/lib/data";

export function CreateProduct() {
  return (
    <Link
      href="/admin/products/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <GoPlus className="h-5 text-xl md:mr-2" />
      <span className="hidden md:block">Create Product</span>{" "}
    </Link>
  );
}

export function EditProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/products/edit/${id}`}
      className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
    >
      <MdOutlineEdit className="w-5 text-xl" />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const deleteProductWithId = deleteProduct.bind(null, id);

  return (
    <form action={deleteProductWithId}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <GoTrash className="w-4 text-xl" />
      </button>
    </form>
  );
}
