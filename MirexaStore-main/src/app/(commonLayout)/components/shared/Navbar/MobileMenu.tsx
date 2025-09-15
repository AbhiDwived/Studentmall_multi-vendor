// src/components/shared/MobileMenu.tsx

"use client"; // Mark this file as a client component since it uses `useState`

import Link from "next/link";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropDown"; // Assuming ProfileDropdown is here

const MobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Hamburger Icon (Mobile Only) */}
      <button className="md:hidden text-white" onClick={toggleMobileMenu}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4 bg-[#F85606] p-4">
          <Link href="/" className="text-white hover:text-gray-200 transition">
            Home
          </Link>
          <Link
            href="/product"
            className="text-white hover:text-gray-200 transition"
          >
            Product
          </Link>
          <Link
            href="/cart"
            className="text-white hover:text-gray-200 transition"
          >
            Cart
          </Link>
          <Link
            href="/add-product"
            className="text-white hover:text-gray-200 transition"
          >
            Add Product
          </Link>

          {/* Profile, Logout, Settings for Mobile */}
          <div className="flex items-center gap-4 mt-4">
            <ProfileDropdown />
            <button className="text-white hover:text-gray-200 transition">
              Logout
            </button>
            <button className="text-white hover:text-gray-200 transition">
              Settings
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
