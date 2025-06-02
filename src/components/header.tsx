"use client";
import { useState } from "react";
import Link from "next/link";
// Import CartButton, UserDropdown, etc.
import { CartButton } from "./cartButton";
import UserDropdown from "@/components/dropDownMenu";
import Search from "./search";

export default function Header({ session }: { session: any }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white text-gray-700 border-b border-gray-200 shadow-sm">
      <nav className="px-6 py-4 max-w-7xl mx-auto">
        {/* Top Row: Brand + Hamburger + User/Cart */}
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-blue-400 transition"
          >
            ShopMate
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center px-2 py-1"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
              />
            </svg>
          </button>

          {/* Search Bar (desktop only) */}
          <div className="hidden md:block flex-1 px-8">
            <Search placeholder="Search products..." />
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-4 ml-4">
            {session ? (
              <UserDropdown user={session?.user} />
            ) : (
              <form action="/signin">
                <button
                  type="submit"
                  className="px-3 py-1 text-sm rounded hover:bg-gray-100/10 transition"
                >
                  Sign in
                </button>
              </form>
            )}
            <CartButton />
          </div>
        </div>

        {/* Mobile: Search & Departments */}
        <div
          className={`md:hidden transition-all duration-200 ${
            menuOpen ? "max-h-screen mt-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <Search placeholder="Search products..." />

          <div className="flex flex-col gap-3 text-base">
            <Link
              href="/departments/produce"
              className="flex items-center gap-1 hover:text-green-400 transition"
            >
              🥦 <span>Produce</span>
            </Link>
            <Link
              href="/departments/bakery"
              className="flex items-center gap-1 hover:text-yellow-400 transition"
            >
              🥖 <span>Bakery</span>
            </Link>
            <Link
              href="/departments/butchery"
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              🥩 <span>Butchery</span>
            </Link>
            <Link
              href="/departments/dairy"
              className="flex items-center gap-1 hover:text-blue-300 transition"
            >
              🥛 <span>Dairy</span>
            </Link>
            <Link
              href="/departments/beverages"
              className="flex items-center gap-1 hover:text-purple-400 transition"
            >
              🥤 <span>Beverages</span>
            </Link>
            <Link
              href="/departments/household"
              className="flex items-center gap-1 hover:text-gray-300 transition"
            >
              🏡 <span>Household</span>
            </Link>
          </div>
        </div>

        {/* Desktop: Departments */}
        <div className="hidden md:flex justify-center gap-6 mt-2 text-sm">
          <Link
            href="/departments/produce"
            className="flex items-center gap-1 hover:text-green-400 transition"
          >
            🥦 <span>Produce</span>
          </Link>

          <Link
            href="/departments/bakery"
            className="flex items-center gap-1 hover:text-yellow-400 transition"
          >
            🥖 <span>Bakery</span>
          </Link>

          <Link
            href="/departments/butchery"
            className="flex items-center gap-1 hover:text-red-400 transition"
          >
            🥩 <span>Butchery</span>
          </Link>

          <Link
            href="/departments/dairy"
            className="flex items-center gap-1 hover:text-blue-300 transition"
          >
            🥛 <span>Dairy</span>
          </Link>

          <Link
            href="/departments/beverages"
            className="flex items-center gap-1 hover:text-purple-400 transition"
          >
            🥤 <span>Beverages</span>
          </Link>

          <Link
            href="/departments/household"
            className="flex items-center gap-1 hover:text-gray-300 transition"
          >
            🏡 <span>Household</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
