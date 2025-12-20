"use client";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8 text-center mt-20 md:mt-28 h-[50vh] grow">
      <div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-2 font-black">Page Not Found</p>
        <p className="text-sm text-gray-500">
          The requested URL <code>{pathname}</code> was not found on this
          server.
        </p>
      </div>
      <Link
        href="/"
        className="group mt-4 inline-flex items-center text-gray-500 bg-gray-100 hover:text-black hover:bg-gray-200 px-4 py-2 rounded transition-colors duration-300"
      >
        <ChevronLeft className="group-hover:-translate-x-2 transition-all duration-300" />{" "}
        Return Home
      </Link>
    </div>
  );
}
