"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, User } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

// Your Original Components
import { CartButton } from "./cartButton";
import UserDropdown from "@/components/dropDownMenu";
import Search from "./search";
import CategoriesBanner from "./categoryBanner";
import { PlainCategoryType, Session } from "@/types";

export default function Header({
  session,
  categories,
}: {
  session: Session;
  categories: PlainCategoryType[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="mr-6 flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ShopMate Logo"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
            <span className="hidden font-bold sm:inline-block">ShopMate</span>
          </Link>

          {/* Desktop Search Bar - Placed centrally and prominently */}
          <div className="hidden flex-1 md:flex justify-center">
            <div className="w-full max-w-md">
              <Search placeholder="What are you looking for?" />
            </div>
          </div>


          {/* Desktop Navigation Actions */}
          <div className="hidden items-center gap-2 md:flex">

            {/* Assuming CartButton manages its own state and icon */}
            <CartButton />

            {session ? (
              <UserDropdown user={session.user} />
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <CartButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[340px]">
                <SheetHeader>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="ShopMate Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-bold">ShopMate</span>
                  </Link>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <Search placeholder="What are you looking for?" />
                  <nav className="flex flex-col gap-2">
                    {session ? (
                      // If UserDropdown is complex, you can create a mobile version
                      // For now, let's assume it works or link to an account page
                      <Button variant="ghost" className="justify-start gap-2" asChild>
                        <Link href="/account">
                          <User className="h-5 w-5" />
                          My Account
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" className="justify-start gap-2" asChild>
                        <Link href="/signin">
                          <User className="h-5 w-5" />
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Category Banner - Sits below the main header */}
      <div className="">
        <CategoriesBanner categories={categories} />
      </div>
    </div>
  );
}