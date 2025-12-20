"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FaBoxOpen,
  FaPlusSquare,
  FaChartBar,
  FaUserFriends,
  FaClipboardList,
  FaTags,
  FaHome,
} from "react-icons/fa";

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="gap-2 flex flex-row md:flex-col w-full justify-between">
      {navLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className={clsx(
            "w-full flex items-center justify-center gap-3 p-2 rounded-md bg-gray-50 transition md:flex-none md:justify-start hover:bg-gray-500 group",
            {
              "bg-gray-500 text-gray-200 cursor-not-allowed pointer-events-none":
                pathname === link.href,
            }
          )}
        >
          <link.Icon className="w-4 h-4 group-hover:text-gray-200" />
          <span className="hidden md:block group-hover:text-gray-200 capitalize">
            {link.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}

const navLinks = [
  { title: "Dashboard", href: "/admin", Icon: FaHome },
  { title: "Products", href: "/admin/products", Icon: FaBoxOpen },
  {
    title: "Create Product",
    href: "/admin/products/create",
    Icon: FaPlusSquare,
  },
  { title: "Orders", href: "/admin/orders", Icon: FaClipboardList },
  { title: "Users", href: "/admin/users", Icon: FaUserFriends },
  { title: "Categories", href: "/admin/categories", Icon: FaTags },
  { title: "Analytics", href: "/admin/analytics", Icon: FaChartBar },
];
