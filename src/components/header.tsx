"use client";

import { useState } from "react";
import Link from "next/link";
import { CartButton } from "./cartButton";
import UserDropdown from "@/components/dropDownMenu";
import { Heart } from "lucide-react";
import Search from "./search";
import Image from "next/image";
import CategoriesBanner from "./categoryBanner";
import { PlainCategoryType, Session } from "@/types";

export default function Header({
  session,
  categories,
}: {
  session: Session;
  categories: PlainCategoryType[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed -top-1 right-0 left-0 w-full bg-white text-gray-700 border-b border-gray-100 z-50 px-4 md:px-8">
      <nav className="py-5 mx-auto">
        {/* Top Row: Brand + Hamburger + User/Cart */}
        <div className="flex items-center justify-between">
          <div className="flex">
            {/* Brand Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight hover:text-blue-400 transition"
            >
              <Image
                src="/logo.png"
                alt="ShopMate Logo"
                width={100}
                height={100}
                priority
                className="h-12 w-12 rounded-full"
              />
            </Link>
          </div>

          {/* Search Bar (desktop only) */}
          <div className="hidden md:block flex-1 px-8">
            <Search placeholder="Search products..." />
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-4 ml-4">
            <Heart />
            <CartButton />

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
          </div>
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
        </div>

        {/* Mobile: Search & Departments */}
        <div
          className={`md:hidden transition-all duration-200 ${
            menuOpen ? "max-h-screen mt-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <Search placeholder="Search products..." />
        </div>
      </nav>
      <CategoriesBanner categories={categories} />
    </header>
  );
}


// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Box,
//   Container,
//   Button,
//   Drawer,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// import { CartButton } from "./cartButton";
// import UserDropdown from "@/components/dropDownMenu";
// import Search from "./search";
// import CategoriesBanner from "./categoryBanner";
// import { PlainCategoryType, Session } from "@/types";

// export default function Header({
//   session,
//   categories,
// }: {
//   session: Session;
//   categories: PlainCategoryType[];
// }) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           backgroundColor: "white",
//           color: "text.primary",
//           borderBottom: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ py: 1 }}>
//             {/* Left: Hamburger + Logo */}
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <IconButton
//                 edge="start"
//                 sx={{ display: { md: "none" }, mr: 1 }}
//                 onClick={() => setMenuOpen(true)}
//                 aria-label="open menu"
//               >
//                 <MenuIcon />
//               </IconButton>

//               <Link href="/" aria-label="Home">
//                 <Image
//                   src="/logo.png"
//                   alt="ShopMate Logo"
//                   width={48}
//                   height={48}
//                   priority
//                   style={{ borderRadius: "50%" }}
//                 />
//               </Link>
//             </Box>

//             {/* Center: Search (desktop) */}
//             <Box sx={{ flex: 1, px: 4, display: { xs: "none", md: "block" } }}>
//               <Search placeholder="Search products..." />
//             </Box>

//             {/* Right: Actions */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <IconButton aria-label="favorites">
//                 <FavoriteBorderIcon />
//               </IconButton>

//               <CartButton />

//               {session ? (
//                 <UserDropdown user={session.user} />
//               ) : (
//                 <Button
//                   component={Link}
//                   href="/signin"
//                   size="small"
//                   sx={{ textTransform: "none" }}
//                 >
//                   Sign in
//                 </Button>
//               )}
//             </Box>
//           </Toolbar>
//         </Container>

//         {/* Categories */}
//         <CategoriesBanner categories={categories} />
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         anchor="left"
//         open={menuOpen}
//         onClose={() => setMenuOpen(false)}
//       >
//         <Box sx={{ width: 280, p: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Image
//               src="/logo.png"
//               alt="ShopMate Logo"
//               width={40}
//               height={40}
//               style={{ borderRadius: "50%" }}
//             />
//             <IconButton onClick={() => setMenuOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box sx={{ mt: 2 }}>
//             <Search placeholder="Search products..." />
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Spacer for fixed AppBar */}
//       <Toolbar />
//     </>
//   );
// }
