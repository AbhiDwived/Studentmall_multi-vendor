import { Metadata } from "next";
import {
  FileText,
  CheckCircle,
  UserPlus,
  UploadCloud,
  ShoppingCart,
  LogOut,
  UserCog,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Guide | Studentmall",
  description: "Step-by-step guide for becoming a seller at Studentmall.",
};

export default function SellerGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#EA580C] mb-2 flex items-center justify-center gap-2">
          <FileText className="w-6 h-6" />
          Seller Guide
        </h1>
        <p className="text-gray-600">
          Follow these steps to become a seller at Studentmall.
        </p>
      </div>

      {/* Guide Steps */}
      <ol className="space-y-8">
        {[
          {
            icon: <UserPlus className="w-5 h-5" />,
            title: "1. Create an Account",
            desc: "Sign up with your email.",
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "2. Request Seller Access",
            desc: "Go to your profile and click \"Become a Seller\". Your request will be sent to the admin.",
          },
          {
            icon: <LogOut className="w-5 h-5" />,
            title: "3. Logout & Login Again",
            desc: "Once your seller request is approved, logout and login again to refresh your access.",
          },

          {
            icon: <UserCog className="w-5 h-5" />,
            title: "4. Complete Seller Profile",
            desc: "Go to your seller dashboard and provide all the required details including your store name, address, logo, banner, and other essential information to build your brand.",
          },

          {
            icon: <UploadCloud className="w-5 h-5" />,
            title: "5. Upload Your Products",
            desc: "Add your products with all necessary details including high-quality images, clear descriptions, accurate pricing, available stock, categories, and product variations (if any).",
          },

          {
            icon: <ShoppingCart className="w-5 h-5" />,
            title: "6. Start Selling",
            desc: "Once your products are approved, start selling and manage your orders.",
          },
        ].map((step, idx) => (
          <li key={idx} className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-[#EA580C] text-white rounded-full p-2 flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Footer Help */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <a href="/contact" className="text-[#EA580C] hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}