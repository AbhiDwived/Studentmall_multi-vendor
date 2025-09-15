"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, X } from "lucide-react";
import {
  FaBox,
  FaChartLine,
  FaClipboardList,
  FaBoxes,
  FaUserCheck,
  FaUserPlus,
  FaMoneyCheckAlt,
} from "react-icons/fa";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// Reusable link style function
const linkStyle = (pathname: string, href: string) =>
  `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition ${
    pathname === href
      ? "bg-[#F6550C]/10 text-[#F6550C]"
      : "text-gray-700 hover:bg-gray-100"
  }`;

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-2 left-0 h-[calc(100vh-0.5rem)] w-64 z-30 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-[#F6550C]">Mirexa Admin</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 text-sm font-medium text-gray-700">
          {/* Dashboard */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Overview
            </p>
            <Link
              href="/dashboard/admin"
              className={linkStyle(pathname, "/dashboard/admin")}
            >
              <LayoutDashboard size={18} className="text-[#F6550C]" />
              Dashboard
            </Link>
          </div>

          {/* Users & Sellers */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Users & Sellers
            </p>
            <div className="space-y-1 ml-2">
              <Link
                href="/dashboard/admin/users"
                className={linkStyle(pathname, "/dashboard/admin/users")}
              >
                <Users size={18} className="text-[#EA580C]" />
                Users
              </Link>
              <Link
                href="/dashboard/admin/seller-validtill"
                className={linkStyle(
                  pathname,
                  "/dashboard/admin/seller-validtill"
                )}
              >
                <FaUserCheck size={18} className="text-[#EA580C]" />
                Seller ValidTill
              </Link>
              <Link
                href="/dashboard/admin/sellerrequest"
                className={linkStyle(
                  pathname,
                  "/dashboard/admin/sellerrequest"
                )}
              >
                <FaUserPlus size={18} className="text-[#EA580C]" />
                Seller Requests
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Products
            </p>
            <div className="space-y-1 ml-2">
              <Link
                href="/dashboard/admin/products"
                className={linkStyle(pathname, "/dashboard/admin/products")}
              >
                <FaBoxes size={18} className="text-[#EA580C]" />
                Products
              </Link>
              <Link
                href="/dashboard/admin/affiliate-products"
                className={linkStyle(
                  pathname,
                  "/dashboard/admin/affiliate-products"
                )}
              >
                <FaChartLine size={18} className="text-[#EA580C]" />
                Affiliate Products
              </Link>
              <Link
                href="/dashboard/admin/products-request"
                className={linkStyle(
                  pathname,
                  "/dashboard/admin/products-request"
                )}
              >
                <FaClipboardList size={18} className="text-[#EA580C]" />
                Product Requests
              </Link>
            </div>
          </div>

          {/* Orders */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Orders
            </p>
            <Link
              href="/dashboard/admin/orders"
              className={linkStyle(pathname, "/dashboard/admin/orders")}
            >
              <FaBox size={18} className="text-[#EA580C]" />
              Orders
            </Link>
          </div>

          {/* Subscription */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Subscription
            </p>
            <Link
              href="/dashboard/admin/subscription-requests"
              className={linkStyle(
                pathname,
                "/dashboard/admin/subscription-requests"
              )}
            >
              <FaMoneyCheckAlt size={18} className="text-[#EA580C]" />
              Subscription Requests
            </Link>
          </div>

          {/* Settings */}
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
              Settings
            </p>
            <Link
              href="/dashboard/admin/settings"
              className={linkStyle(pathname, "/dashboard/admin/settings")}
            >
              <Settings size={18} className="text-[#EA580C]" />
              Settings
            </Link>
          </div>
        </nav>

        {/* Logout Button */}
        {/* <div className="absolute bottom-4 left-0 w-full px-4">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition">
            <LogOut size={18} />
            Logout
          </button>
        </div> */}
      </aside>
    </>
  );
};

export default AdminSidebar;
