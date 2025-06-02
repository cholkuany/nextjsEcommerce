"use client";

import { FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
      <FaTimesCircle className="text-red-500 text-7xl mb-6" />
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Canceled</h1>
      <p className="text-lg text-red-800 mb-8 text-center max-w-md">
        It looks like you canceled the checkout. No worries — you can always try
        again whenever you're ready.
      </p>
      <Link
        href="/cart"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Return to Cart
      </Link>
    </div>
  );
}
