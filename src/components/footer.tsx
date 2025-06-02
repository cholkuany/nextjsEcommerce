// components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-700 mt-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Shop */}
        <div>
          <h3 className="font-semibold mb-2">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/categories">All Departments</Link>
            </li>
            <li>
              <Link href="/deals">Deals</Link>
            </li>
            <li>
              <Link href="/grocery">Grocery</Link>
            </li>
            <li>
              <Link href="/electronics">Electronics</Link>
            </li>
            <li>
              <Link href="/fashion">Clothing</Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-2">Customer Service</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/returns">Returns</Link>
            </li>
            <li>
              <Link href="/shipping">Shipping Info</Link>
            </li>
            <li>
              <Link href="/account">Your Account</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-semibold mb-2">About Us</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about">Company Info</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
            <li>
              <Link href="/press">Press</Link>
            </li>
            <li>
              <Link href="/sustainability">Sustainability</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/terms">Terms of Use</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/accessibility">Accessibility</Link>
            </li>
            <li>
              <Link href="/sitemap">Site Map</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-4 pb-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ShopMate Inc. All rights reserved.
      </div>
    </footer>
  );
}
