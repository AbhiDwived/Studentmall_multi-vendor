import Link from "next/link";
import SearchBar from "./Navbar/SearchBar";
import ProfileDropdown from "./Navbar/ProfileDropDown";
import CartButton from "./Navbar/CartButton";
import Image from "next/image";
import ClickSparkWrapper from "../reactbit/ClickSparkWrapper/ClickSparkWrapper";
import {
  Home,
  Package,
  ShoppingCart,
  Store,
  UserPlus,
  LifeBuoy,
  Contact,
  HelpCircle,
  Truck,
  Undo2,
  BookText,
  FileText,
  CheckCircle,
} from "lucide-react";

const Navbar = () => {
  return (
    <ClickSparkWrapper>
      <header className="bg-[#F6550C] shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-3 py-2 lg:py-3">
          <Link href="/" className="flex items-center min-w-[140px]">
            <Image
              src="/favicon.ico"
              alt="MirexaStore Logo"
              width={140}
              height={45}
              className="h-[42px] w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex gap-6 text-sm items-center text-white font-semibold">
            {/* Home */}
            <Link href="/" className="relative flex items-center gap-1 group">
              <Home className="w-3.5 h-3.5 text-white" />
              <span className="relative z-10">Home</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            {/* Products */}
            <Link
              href="/products"
              className="relative flex items-center gap-1 group"
            >
              <Package className="w-3.5 h-3.5 text-white" />
              <span className="relative z-10">Products</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1 group"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
              <span className="relative z-10">Cart</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            {/* Shops */}
            <Link
              href="/stores"
              className="relative flex items-center gap-1 group"
            >
              <Store className="w-3.5 h-3.5 text-white" />
              <span className="relative z-10">Shops</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            {/* Become a Seller */}
            <Link
              href="/seller-request"
              className="relative flex items-center gap-1 group"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span className="relative z-10">Become a Seller</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            {/* Customer Service Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 cursor-pointer text-white font-semibold hover:text-gray-200 transition duration-300 text-sm px-2 py-1"
                aria-haspopup="true"
                aria-expanded="false"
                type="button"
              >
                <LifeBuoy className="w-4 h-4" />
                Customer Service
                <svg
                  className="w-3 h-3 mt-1 ml-1 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md border border-gray-200 shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 invisible group-hover:visible transition-all duration-300 ease-in-out z-50 p-4"
                role="menu"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 select-none">
                  Customer Service
                </h3>
                <ul className="space-y-3 text-base text-gray-800">
                  {[
                    { href: "/contact", icon: Contact, label: "Contact Us" },
                    { href: "/faq", icon: HelpCircle, label: "FAQs" },
                    {
                      href: "/shipping-policy",
                      icon: Truck,
                      label: "Shipping Policy",
                    },
                    {
                      href: "/return-policy",
                      icon: Undo2,
                      label: "Return & Refund Policy",
                    },
                    { href: "/blog", icon: BookText, label: "Blog" },
                    {
                      href: "/seller-guide",
                      icon: FileText,
                      label: "Seller Guide / সেলার গাইড",
                    },
                    {
                      href: "/seller-benefits",
                      icon: CheckCircle,
                      label: "Why Become a Seller? / কেন সেলার হবেন?",
                    },
                  ].map(({ href, icon: Icon, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#F6550C] hover:underline transition-colors duration-200"
                        role="menuitem"
                      >
                        <Icon className="w-5 h-5 flex-shrink-0 text-[#F6550C]" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <SearchBar />
            <CartButton />
            <div className="ml-auto">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </ClickSparkWrapper>
  );
};

export default Navbar;
