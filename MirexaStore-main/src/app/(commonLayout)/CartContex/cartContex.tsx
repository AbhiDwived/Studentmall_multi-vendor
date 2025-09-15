"use client";
// context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  updateCart: (newCartCount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const updateCart = (newCartCount: number) => {
    setCartCount(newCartCount);
    localStorage.setItem("cart", JSON.stringify(newCartCount)); // Keep it in localStorage for persistence
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
