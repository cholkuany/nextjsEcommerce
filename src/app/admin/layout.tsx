// app/admin/layout.tsx
import "@/app/globals.css";
import Link from "next/link";
import {
  FaBoxOpen,
  FaPlusSquare,
  FaChartBar,
  FaUserFriends,
  FaClipboardList,
  FaTags,
  FaHome,
} from "react-icons/fa";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white px-4 py-6 space-y-1">
        <h2 className="text-xl font-bold text-center text-green-600  mb-2 flex items-end justify-start rounded-md p-4">
          Admin Panel
        </h2>
        <nav className="space-y-2 gap-2 flex flex-row md:flex-col w-full justify-between">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="w-full flex items-center justify-center gap-3 p-2 md:p-4 rounded-md bg-gray-50 transition md:flex-none md:justify-start hover:bg-green-700"
            >
              <link.Icon className="w-5 h-5 text-green-600" />
              <span className="hidden md:block">{link.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="grow p-2 md:p-12">{children}</main>
    </div>
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
