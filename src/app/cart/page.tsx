"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/app/providers/cartContext/context";
import { IoReturnUpBack } from "react-icons/io5";

import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi2";
import { CartItem } from "@/types";

export default function CartPage() {
  const { cart, addToCart, updateQuantity, deleteProductFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateProduct = (item: CartItem) => {
    if (item.quantity - 1 === 0) { deleteProductFromCart(item.id) }
    else {
      updateQuantity(item.id, item.quantity - 1);
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-gray-600 text-center px-4">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <IoReturnUpBack className="text-xl" />
          Start shopping!
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("CART>>>", cart);
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            cartItems: cart
            // items: cart.map((item) => ({
            //   name: item.name,
            //   price: item.price,
            //   description: item.description,
            //   quantity: item.quantity,
            //   images: [item.baseImage],
            //   sku: item.variantSku,
            //   variantOptions: item.variantOptions,
            // })),
          }
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      const { url } = await response.json();
      if (!url) {
        throw new Error("No URL returned from checkout session");
      }
      window.location.href = url;
      console.log("Response from checkout API:", response);
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 py-8 md:py-10 rounded-lg">
      <h4 className="text-4xl font-bold mb-4 md:mb-8 text-gray-800">
        Your Cart
      </h4>

      <div className="space-y-1">
        {cart.map((item) => (
          <div
            key={item.variantSku}
            className="border-t border-t-gray-100 last:border-b last:border-b-gray-100 flex flex-col justify-between items-start bg-white p-5 transition"
          >
            <div className="flex justify-between w-full space-x-2">
              <Image
                src={item.baseImage}
                alt={item.name}
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-1">
                <h6 className="text-sm/6 md:text-xl/6 font-semibold text-gray-800">
                  {item.name}
                </h6>
                <p className="text-sm text-gray-500">
                  (${item.price.toFixed(2)} x {item.quantity})
                </p>
                {/* <p className="text-sm/4">{item.description}</p> */}
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-sm md:text-lg font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto self-end flex items-center justify-between mt-3 space-x-3 md:space-x-20">
              <button
                onClick={() => deleteProductFromCart(item.id)}
                className="flex items-center justify-center underline decoration-1 cursor-pointer hover:text-red-700 hover:no-underline"
                title="Remove from cart"
              >
                Remove
              </button>

              <div className="flex items-center space-x-2 p-1 outline outline-gray-600 rounded-full">
                <button
                  onClick={() => updateProduct(item)}
                  className="flex items-center justify-center w-8 h-8 text-white bg-gray-500 hover:bg-gray-600 rounded-full disabled:opacity-40"
                >
                  <HiMinus />
                </button>

                <span className="text-lg font-medium px-3">
                  {item.quantity}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-blue-600 hover:bg-blue-700"
                >
                  <GoPlus />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            Total: ${total.toFixed(2)}
          </p>
          <button
            disabled={isLoading}
            className={`mt-4 inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md transition ${isLoading
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              } text-white`}
            onClick={handleCheckout}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Redirecting..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
