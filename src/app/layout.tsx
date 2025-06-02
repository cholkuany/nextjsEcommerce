import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers/cartContext/context";
import { auth } from "@/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <CartProvider>
          {/* 🌐 NAVBAR */}
          <Header session={session} />

          {/* 🧱 PAGE CONTENT */}
          <main className="w-full mx-auto p-0 md:p-6">{children}</main>
        </CartProvider>
        {/* 🔻 FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
