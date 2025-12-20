import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers/cartContext/context";
import { auth } from "@/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { fetchCategories } from "@/app/lib/data";
import { Session } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000/"),
  title: {
    default: "ShopMate",
    template: "%s | ShopMate",
  },
  description: "Discover and shop your favorite products on ShopMate.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session: Session = await auth();
  const categories = await fetchCategories();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative font-sans antialiased px-2 md:px-8 mt-44`}
      >
        <CartProvider>
          {/* 🌐 NAVBAR */}
          <Header session={session} categories={categories} />

          {/* 🧱 PAGE CONTENT */}
          <main className="w-full mx-auto">{children}</main>
        </CartProvider>
        {/* 🔻 FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
