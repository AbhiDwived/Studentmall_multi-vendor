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
  title: "Seller Guide | MirexaStore",
  description: "Step-by-step guide for becoming a seller at MirexaStore.",
};

export default function SellerGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#EA580C] mb-2 flex items-center justify-center gap-2">
          <FileText className="w-6 h-6" />
          Seller Guide / সেলার গাইডলাইন..
        </h1>
        <p className="text-gray-600">
          Follow these steps to become a seller at MirexaStore. <br />
          নীচের ধাপগুলো অনুসরণ করে আপনি MirexaStore-এ একজন সেলার হতে পারবেন।
        </p>
      </div>

      {/* Guide Steps */}
      <ol className="space-y-8">
        {[
          {
            icon: <UserPlus className="w-5 h-5" />,
            title: "1. Create an Account / অ্যাকাউন্ট খুলুন",
            desc: `Sign up with your email.\nআপনার ইমেইল দিয়ে রেজিস্ট্রেশন করুন।`,
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "2. Request Seller Access / সেলার অনুরোধ পাঠান",
            desc: `Go to your profile and click "Become a Seller". Your request will be sent to the admin.\nপ্রোফাইলে গিয়ে "Become a Seller" বাটনে ক্লিক করুন। আপনার অনুরোধ অ্যাডমিন-এর কাছে যাবে।`,
          },
          {
            icon: <LogOut className="w-5 h-5" />,
            title: "3. Logout & Login Again / লগআউট করে আবার লগইন করুন",
            desc: `Once your seller request is approved, logout and login again to refresh your access.\nঅ্যাডমিন আপনার সেলার অনুরোধ গ্রহণ করলে, নিরাপত্তার স্বার্থে আপনাকে লগআউট করে আবার লগইন করতে হবে। এতে করে আপনার সেলার এক্সেস সক্রিয় হবে।`,
          },

          {
            icon: <UserCog className="w-5 h-5" />,
            title: "4. Complete Seller Profile / সেলার প্রোফাইল পূরণ করুন",
            desc: `Go to your seller dashboard and provide all the required details including your store name, address, logo, banner, and other essential information to build your brand.\nসেলার ড্যাশবোর্ডে যান এবং আপনার দোকানের নাম, ঠিকানা, লোগো, ব্যানার ও অন্যান্য প্রয়োজনীয় তথ্য দিয়ে আপনার স্টোর বা ব্র্যান্ড তৈরি করুন।`,
          },

          {
            icon: <UploadCloud className="w-5 h-5" />,
            title: "5. Upload Your Products / প্রোডাক্ট আপলোড করুন",
            desc: `Add your products with all necessary details including high-quality images, clear descriptions, accurate pricing, available stock, categories, and product variations (if any).\nপ্রয়োজনীয় সব তথ্যসহ আপনার প্রোডাক্ট আপলোড করুন — যেমন উচ্চ মানের ছবি, বিস্তারিত বিবরণ, সঠিক মূল্য, স্টক, ক্যাটাগরি এবং ভ্যারিয়েশন (যদি থাকে)।`,
          },

          {
            icon: <ShoppingCart className="w-5 h-5" />,
            title: "6. Start Selling / বিক্রি শুরু করুন",
            desc: `Once your products are approved, start selling and manage your orders.\nপ্রোডাক্ট অনুমোদনের পর আপনি বিক্রি শুরু করতে পারবেন এবং অর্ডার ম্যানেজ করতে পারবেন।`,
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
            Contact support / সহায়তা নিন
          </a>
        </p>
      </div>
    </main>
  );
}
