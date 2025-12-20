import Link from "next/link";
import { Slash } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return (
    <div className="mt-40">
      <nav className="flex flex-row gap-4 capitalize">
        <Link href="/" className="underline underline-offset-1 text-gray-500">
          Home
        </Link>{" "}
        <Slash />
        <p>{category}</p>
      </nav>
      <div className="flex flex-wrap"></div>
    </div>
  );
}
