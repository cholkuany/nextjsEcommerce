"use client";

import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <FaCheckCircle className="text-green-500 text-7xl mb-6" />
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-green-800 mb-8 text-center max-w-md">
        Thank you for your purchase. Your transaction was completed
        successfully.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
