"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { signOutAction } from "./signOutAction";
import { User } from "@/types";

export default function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center focus:outline-none"
      >
        {user?.image ? (
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full">
            <Image
              src={user.image}
              alt={user.name || "User avatar"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <h6 className="capitalize tracking-tight">{user.name}</h6>
          </div>
        ) : (
          <FaUser size={18} className="text-blue-400" />
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 transition-all duration-200 ease-out scale-95 opacity-0 ${
            open ? "opacity-100 scale-100" : ""
          }
`}
        >
          <div className="py-2 px-4 text-sm text-gray-800 dark:text-gray-100 border-b dark:border-gray-700">
            Hello, {user?.name || "Guest"}
          </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Sign out
            </button>
          </form>
          {user?.role === "admin" && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
