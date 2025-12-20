"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback
} from "react";
import { CartItem, CartContextType } from "@/types";
const emptyArray: CartContextType = {
  cart: [],
  addToCart: () => { },
  updateQuantity: () => { },
  deleteProductFromCart: () => { },
  clearCart: () => { },
};

const CartContext = createContext<CartContextType | undefined>(emptyArray);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product }];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const deleteProductFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((t) => t.id !== productId));
  };

  // const clearCart = () => {
  //   setCart([]);
  //   localStorage.removeItem("cart")
  // }
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);


  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, updateQuantity, deleteProductFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
