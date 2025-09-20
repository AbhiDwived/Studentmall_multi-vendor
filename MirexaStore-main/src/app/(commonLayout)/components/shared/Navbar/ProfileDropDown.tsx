"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/app/lib/redux/features/authSlice";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";
import { Avatar, AvatarIcon } from "@heroui/react";
import {
  LogIn,
  UserPlus,
  LogOut,
  ShoppingCart,
  PackageCheck,
  LayoutDashboard,
  Store,
  BarChart2,
  Settings,
  Plus,
  Users,
  ClipboardList,
  Home,
  ShoppingBasket,
  FileWarning,
  PlusCircle,
  CalendarCheck,
  BadgeCheck,
  UserCheck,
  LayoutDashboardIcon,
} from "lucide-react";
import { FaHandshake } from "react-icons/fa";

const ProfileDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sellerSlug, setSellerSlug] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  // Handle fallback image logic
  const [imgSrc, setImgSrc] = useState(
    user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
  );

  useEffect(() => {
    // Update imgSrc when user data changes
    setImgSrc(
      user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
    );
  }, [user?.photo]);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    dispatch(logoutUser());
    setIsOpen(false);
    router.push("/login");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch seller profile on load (if user is seller)
  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (!user?.email || user.role !== "seller") return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user.email}`
        );
        setSellerSlug(res.data?.data?.brand?.slug || "");
      } catch (error: any) {
        // Silently handle 404 errors - seller profile might not exist yet
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch seller profile", error);
        }
      }
    };

    fetchSellerProfile();
  }, [user?.email, user?.role]);

  return (
    <div ref={dropdownRef} className="dropdown dropdown-end">
      <button
        onClick={handleToggle}
        tabIndex={0}
        className="btn btn-ghost btn-circle"
      >
        {/* Desktop avatar */}
        <div className="hidden lg:block w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden">
          <div className="flex items-center">
            <Avatar
              classNames={{
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-black/80",
              }}
              icon={<AvatarIcon />}
            />
          </div>
        </div>

        {/* Mobile menu icon */}
        <div className="block lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-white text-black rounded-lg shadow-lg mt-3 w-48"
        >
          {user ? (
            <>
              {user?.role === "admin" && (
                <>
                  <li>
                    <Link
                      href="/dashboard/admin"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboardIcon className="w-5 h-5 text-[#EA580C]" />
                      Dashboard
                    </Link>
                  </li>
                </>
              )}

              {user?.role === "seller" && (
                <>
                  <li>
                    <Link
                      href="/dashboard/seller"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboardIcon className="w-5 h-5 text-[#EA580C]" />
                      Dashboard
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/seller/orders"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <PackageCheck className="w-5 h-5 text-[#EA580C]" />
                      Order Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller/products"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingBasket className="w-5 h-5 text-[#EA580C]" />
                      Product Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller/inactive-draft"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <FileWarning className="w-5 h-5 text-yellow-600" />
                      Inactive & Under-review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller/analytics"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <BarChart2 className="w-5 h-5 text-[#EA580C]" />
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller/subscription"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <BadgeCheck className="w-5 h-5 text-[#EA580C]" />
                      Subscription
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/seller/profile"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5 text-[#EA580C]" />
                      Profile Settings
                    </Link>
                  </li>

                  {sellerSlug ? (
                    <li>
                      <Link
                        href={`/store/${sellerSlug}`}
                        onClick={handleLinkClick}
                        className="hover:bg-gray-100 font-bold text-[#EA580C] p-2 rounded-lg flex items-center gap-2"
                      >
                        <Store className="w-5 h-5 text-[#EA580C]" />
                        My Store
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        href="/seller-request"
                        onClick={handleLinkClick}
                        className="hover:bg-gray-100 font-bold text-[#EA580C] p-2 rounded-lg flex items-center gap-2"
                      >
                        <ClipboardList className="w-5 h-5 text-[#EA580C]" />
                        My Request
                      </Link>
                    </li>
                  )} */}
                </>
              )}

              {user?.role === "user" && (
                <>
                  <li>
                    <Link
                      href="/products"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingBasket className="w-5 h-5 text-[#EA580C]" />
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5 text-[#EA580C]" />
                      Shopping Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart/checkout"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <PackageCheck className="w-5 h-5 text-[#EA580C]" />
                      Checkout
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/order-history"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                    >
                      <ClipboardList className="w-5 h-5 text-[#EA580C]" />
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller-request"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 font-bold text-[#EA580C] p-2 rounded-lg flex items-center gap-2"
                    >
                      <Store className="w-5 h-5 text-[#EA580C]" />
                      Become a Seller
                    </Link>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5 text-[#EA580C]" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5 text-[#EA580C]" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={handleLinkClick}
                  className="hover:bg-gray-100 p-2 rounded-lg flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5 text-[#EA580C]" />
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
