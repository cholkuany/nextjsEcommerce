// app/admin/layout.tsx
import "@/app/globals.css";

import { ReactNode } from "react";
import { AdminNavigation } from "./navLinks";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-screen overflow-hidden flex flex-col md:flex-row mt-24 md:mt-28">
      {/* Sidebar */}
      <aside className="fixed w-full -mt-4 md:mt-0 py-2 md:w-64 bg-white px-4 space-y-1 flex flex-col-reverse md:flex-col z-30">
        <h2 className="text-xl font-bold text-center text-gray-600  mb-2 flex items-end justify-start rounded-md">
          Admin Panel
        </h2>
        <AdminNavigation />
      </aside>

      {/* Main content */}
      <main className="grow px-2 md:pl-64 mx-auto min-h-[50vh]">
        {children}
      </main>
    </div>
  );
}
