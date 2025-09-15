import { Metadata } from "next";
import {
  Trophy,
  DollarSign,
  Users,
  Truck,
  ShieldCheck,
  BarChart2,
  Gift,
  Clock,
  Smile,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Benefits | MirexaStore",
  description: "Learn the benefits of becoming a seller at MirexaStore.",
};

export default function SellerBenefitsPage() {
  const benefits = [
    {
      icon: <Trophy className="w-5 h-5 text-white" />,
      title: "Grow Your Business / আপনার ব্যবসা বাড়ান",
      desc: `Reach millions of customers across Bangladesh through our platform.\nআমাদের প্ল্যাটফর্মের মাধ্যমে সারা বাংলাদেশে লক্ষ লক্ষ গ্রাহকের কাছে পৌঁছান।`,
    },
    {
      icon: <DollarSign className="w-5 h-5 text-white" />,
      title: "Competitive Fees / প্রতিযোগিতামূলক ফি",
      desc: `Enjoy low commission rates that help maximize your profits.\nকমিশন ফি কম হওয়ায় আপনার লাভ সর্বাধিক হবে।`,
    },
    {
      icon: <Gift className="w-5 h-5 text-white" />,
      title: "First Month Free Trial / প্রথম মাস ফ্রি ট্রায়াল",
      desc: `Try selling with zero commission fees for the first month.\nপ্রথম মাসে কোন কমিশন ছাড়াই বিক্রি শুরু করুন।`,
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: "Seller Support / সেলার সাপোর্ট",
      desc: `Get dedicated support from our seller success team anytime.\nআমাদের সেলার সাপোর্ট টিম থেকে যেকোনো সময় সহায়তা পান।`,
    },
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      title: "Reliable Shipping / নির্ভরযোগ্য শিপিং",
      desc: `We partner with trusted logistics for smooth delivery.\nআমরা বিশ্বস্ত লজিস্টিকস কোম্পানির সাথে কাজ করি যাতে দ্রুত ও নিরাপদ ডেলিভারি হয়।`,
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: "Secure Payments / নিরাপদ পেমেন্ট",
      desc: `Receive timely payments directly to your bank account.\nআপনার ব্যাংক একাউন্টে সময়মতো নিরাপদ পেমেন্ট পেয়ে যান।`,
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-white" />,
      title: "Analytics & Insights / অ্যানালিটিক্স ও ইনসাইট",
      desc: `Track your sales and performance with easy-to-understand reports.\nসহজে বুঝতে পারার মতো রিপোর্টের মাধ্যমে আপনার বিক্রয় ও পারফরমেন্স ট্র্যাক করুন।`,
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "Flexible Working Hours / ফ্লেক্সিবল কাজের সময়",
      desc: `Manage your store anytime, anywhere at your convenience.\nআপনার সুবিধামতো যেকোনো সময় ও স্থানে দোকান পরিচালনা করুন।`,
    },
    {
      icon: <Smile className="w-5 h-5 text-white" />,
      title: "Build Customer Trust / গ্রাহকের বিশ্বাস অর্জন করুন",
      desc: `Leverage our platform’s reputation to boost your brand’s credibility.\nআমাদের প্ল্যাটফর্মের বিশ্বস্ততা ব্যবহার করে আপনার ব্র্যান্ডের বিশ্বাসযোগ্যতা বাড়ান।`,
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#EA580C] mb-2 flex items-center justify-center gap-2">
          {/* You can add an icon here if you want */}
          Seller Benefits / সেলার সুবিধাসমূহ
        </h1>
        <p className="text-gray-600 text-sm whitespace-pre-line max-w-xl mx-auto">
          Discover why becoming a seller on MirexaStore is a great opportunity.
          <br />
          জানুন কেন MirexaStore-এ সেলার হওয়া আপনার জন্য একটি অসাধারণ সুযোগ।
        </p>
      </div>

      <ul className="space-y-8">
        {benefits.map(({ icon, title, desc }, idx) => (
          <li key={idx} className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-[#EA580C] text-white rounded-full p-2 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {desc}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Ready to join?{" "}
          <a href="/seller-request" className="text-[#EA580C] hover:underline">
            Apply now / এখনই আবেদন করুন
          </a>
        </p>
      </div>
    </main>
  );
}
