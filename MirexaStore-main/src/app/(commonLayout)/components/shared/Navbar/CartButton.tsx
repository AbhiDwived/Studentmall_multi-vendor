"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/solid"; // Using ShoppingBagIcon

const CartButton = () => {
  const [cartCount, setCartCount] = useState<number>(0);

  // Function to update cart count
  const updateCartCount = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cartData.length);
  };

  useEffect(() => {
    updateCartCount(); // Initial cart count load

    // Listen for the custom event "cartUpdated"
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <Link href="/cart" className="relative group">
      <button className="flex items-center gap-2 bg-[#F85606] text-[white] px-1 lg:px-4 py-1 lg:py-2  rounded-full p-2 shadow-lg transform hover:scale-105 border border-white transition">
        <ShoppingBagIcon className="h-6 w-6" />
        <span className="hidden md:inline font-medium">Cart</span>
      </button>
      {/* Cart Item Count Badge */}
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full group-hover:scale-110 transition">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
