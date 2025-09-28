"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  X,
  Plus,
  PackageCheck,
  ShoppingBasket,
  FileWarning,
  BadgeCheck,
  Store,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Tags,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";

interface SellerSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SellerSidebar = ({ isOpen, setIsOpen }: SellerSidebarProps) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sellerSlug, setSellerSlug] = useState<string | null>(null);

  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({
    products: false,
    orders: false,
    settings: false,
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (!user?.email || user.role !== "seller") {
        setSellerSlug(null);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user.email}`,
          { 
            validateStatus: (status) => status < 500,
            timeout: 5000
          }
        );
        
        if (res.status === 200 && res.data?.success) {
          setSellerSlug(res.data.data?.brand?.slug || null);
        } else {
          setSellerSlug(null);
        }
      } catch (error: any) {
        setSellerSlug(null);
        // Only log server errors, ignore 404s
        if (error.response?.status >= 500) {
          console.error('Server error fetching seller profile:', error);
        }
      }
    };

    // Only fetch once when component mounts
    fetchSellerProfile();
  }, [user?.email, user?.role]);

  const linkStyle = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition ${
      pathname === href
        ? "bg-[#F6550C]/10 text-[#F6550C]"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-[#F6550C]">Mirexa Seller</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-6 text-sm font-medium text-gray-700">
          {/* SECTION: Store Overview */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Store Overview
            </p>
            <Link
              href="/dashboard/seller"
              className={linkStyle("/dashboard/seller")}
            >
              <LayoutDashboard size={18} className="text-[#EA580C]" />
              Dashboard
            </Link>
          </div>

          {/* SECTION: Product Management */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Products
            </p>
            <div className="space-y-1 ml-2">
              <Link
                href="/dashboard/seller/addProduct"
                className={linkStyle("/dashboard/seller/addProduct")}
              >
                <Plus size={16} className="text-[#EA580C]" />
                Add Product
              </Link>
              <Link
                href="/dashboard/seller/products"
                className={linkStyle("/dashboard/seller/products")}
              >
                <ShoppingBasket size={16} className="text-[#EA580C]" />
                Product Management
              </Link>
              <Link
                href="/dashboard/seller/inactive-draft"
                className={linkStyle("/dashboard/seller/inactive-draft")}
              >
                <FileWarning size={16} className="text-yellow-600" />
                Inactive / Under-review
              </Link>
              <Link
                href="/dashboard/seller/categories"
                className={linkStyle("/dashboard/seller/categories")}
              >
                <Tags size={16} className="text-[#EA580C]" />
                Categories
              </Link>
              <Link
                href="/dashboard/seller/brands"
                className={linkStyle("/dashboard/seller/brands")}
              >
                <Store size={16} className="text-[#EA580C]" />
                Brands
              </Link>
              <Link
                href="/dashboard/seller/slugs"
                className={linkStyle("/dashboard/seller/slugs")}
              >
                <Tags size={16} className="text-[#EA580C]" />
                Slugs
              </Link>
              <Link
                href="/dashboard/seller/subslugs"
                className={linkStyle("/dashboard/seller/subslugs")}
              >
                <Tags size={16} className="text-[#EA580C]" />
                SubSlugs
              </Link>
            </div>
          </div>

          {/* SECTION: Orders */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Orders & Sales
            </p>
            <Link
              href="/dashboard/seller/orders"
              className={linkStyle("/dashboard/seller/orders")}
            >
              <PackageCheck size={18} className="text-[#EA580C]" />
              Order Management
            </Link>
          </div>

          {/* SECTION: Settings */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Settings & Subscription
            </p>
            <Link
              href="/dashboard/seller/subscription"
              className={linkStyle("/dashboard/seller/subscription")}
            >
              <BadgeCheck size={18} className="text-[#EA580C]" />
              Subscription
            </Link>
            <Link
              href="/dashboard/seller/profile"
              className={linkStyle("/dashboard/seller/profile")}
            >
              <Settings size={18} className="text-[#EA580C]" />
              Profile Settings
            </Link>
          </div>

          {/* SECTION: Store or Request */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Store Access
            </p>
            {sellerSlug ? (
              <Link
                href={`/store/${sellerSlug}`}
                className={linkStyle(`/store/${sellerSlug}`)}
              >
                <Store size={18} className="text-[#EA580C]" />
                My Store
              </Link>
            ) : (
              <Link
                href="/seller-request"
                className={linkStyle("/seller-request")}
              >
                <ClipboardList size={18} className="text-[#EA580C]" />
                My Request
              </Link>
            )}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
