"use client";

import Link from "next/link";
import {
  Home,
  ShoppingCart,
  PackageSearch,
  BookText,
  Contact,
  Undo2,
  Truck,
  HelpCircle,
  FileText,
  CheckCircle,
} from "lucide-react";
import SellerClientButton from "./FooterCsr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
const FooterClientLinks = () => {
  return (
    <>
      {/* Customer Service */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>

        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/contact"
              className="flex items-center gap-2 hover:underline"
            >
              <Contact className="w-4 h-4" /> Contact Us
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="flex items-center gap-2 hover:underline"
            >
              <HelpCircle className="w-4 h-4" /> FAQs
            </Link>
          </li>
          <li>
            <Link
              href="/shipping-policy"
              className="flex items-center gap-2 hover:underline"
            >
              <Truck className="w-4 h-4" /> Shipping Policy
            </Link>
          </li>
          <li>
            <Link
              href="/return-policy"
              className="flex items-center gap-2 hover:underline"
            >
              <Undo2 className="w-4 h-4" /> Return & Refund Policy
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="flex items-center gap-2 hover:underline"
            >
              <BookText className="w-4 h-4" /> Blog
            </Link>
          </li>
          <li>
            <Link
              href="/seller-guide"
              className="flex items-center gap-2 hover:underline"
            >
              <FileText className="w-4 h-4" />
              Seller Guide / সেলার গাইড
            </Link>
          </li>
          <li>
            <Link
              href="/seller-benefits"
              className="flex items-center gap-2 hover:underline"
            >
              <CheckCircle className="w-4 h-4 " />
              Why Become a Seller? / কেন সেলার হবেন?
            </Link>
          </li>
        </ul>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/" className="flex items-center gap-2 hover:underline">
              <Home className="w-4 h-4" /> Home
            </Link>
          </li>
          <li>
            <Link
              href="/product"
              className="flex items-center gap-2 hover:underline"
            >
              <PackageSearch className="w-4 h-4" /> Products
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="flex items-center gap-2 hover:underline"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
        <p className="text-sm mb-2">📞 +8801405671742</p>
        <p className="text-sm mb-4">✉️ mdeasinsarkar01@gmail.com</p>

        <SellerClientButton />
      </div>
      {/* Social Icons */}
      <div className="flex gap-4 mt-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="text-[#1877F2] transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
        >
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-[#1DA1F2] transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-[#E1306C] transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
        >
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
      </div>
    </>
  );
};

export default FooterClientLinks;
