"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/app/providers/cartContext/context";
import { IoReturnUpBack } from "react-icons/io5";

import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi2";

export default function CartPage() {
  const { cart, addToCart, updateQuantity, deleteProductFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity,
            images: item.images,
          })),
        }),
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
    <div className="max-w-5xl mx-auto px-2 md:px-4 py-2 md:py-10 rounded-lg">
      <h1 className="text-4xl font-bold mb-4 md:mb-8 text-gray-800">
        Your Cart
      </h1>

      <div className="space-y-1">
        {cart.map((item) => (
          <div
            key={item.id}
            className="border-t border-t-gray-100 last:border-b last:border-b-gray-100 flex flex-col justify-between items-start bg-white p-5 transition"
          >
            <div className="flex justify-between w-full space-x-2">
              <Image
                src={item.images[0]}
                alt={item.name}
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-1">
                <h2 className="text-sm/6 md:text-xl/6 font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  (${item.price.toFixed(2)} x {item.quantity})
                </p>
                <p className="text-sm/4">{item.description}</p>
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
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
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
            className="mt-4 inline-block px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 transition"
            onClick={handleCheckout}
          >
            {isLoading && (
              <svg
                className="animate-spin mr-3 size-5"
                viewBox="0 0 24 24"
              ></svg>
            )}
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
