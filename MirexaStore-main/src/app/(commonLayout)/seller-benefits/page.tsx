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
  title: "Seller Benefits | Studentmall",
  description: "Learn the benefits of becoming a seller at Studentmall.",
};

export default function SellerBenefitsPage() {
  const benefits = [
    {
      icon: <Trophy className="w-5 h-5 text-white" />,
      title: "Grow Your Business",
      desc: "Reach millions of customers across Bangladesh through our platform.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-white" />,
      title: "Competitive Fees",
      desc: "Enjoy low commission rates that help maximize your profits.",
    },
    {
      icon: <Gift className="w-5 h-5 text-white" />,
      title: "First Month Free Trial",
      desc: "Try selling with zero commission fees for the first month.",
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: "Seller Support",
      desc: "Get dedicated support from our seller success team anytime.",
    },
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      title: "Reliable Shipping",
      desc: "We partner with trusted logistics for smooth delivery.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: "Secure Payments",
      desc: "Receive timely payments directly to your bank account.",
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-white" />,
      title: "Analytics & Insights",
      desc: "Track your sales and performance with easy-to-understand reports.",
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "Flexible Working Hours",
      desc: "Manage your store anytime, anywhere at your convenience.",
    },
    {
      icon: <Smile className="w-5 h-5 text-white" />,
      title: "Build Customer Trust",
      desc: "Leverage our platform's reputation to boost your brand's credibility.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#0A3D62] mb-2 flex items-center justify-center gap-2">
          Seller Benefits
        </h1>
        <p className="text-[#4B4B4B] text-sm whitespace-pre-line max-w-xl mx-auto">
          Discover why becoming a seller on Studentmall is a great opportunity.
        </p>
      </div>

      <ul className="space-y-8">
        {benefits.map(({ icon, title, desc }, idx) => (
          <li key={idx} className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-[#F39C12] text-white rounded-full p-2 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0A3D62]">{title}</h3>
              <p className="text-[#4B4B4B] text-sm whitespace-pre-line">
                {desc}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <p className="text-sm text-[#4B4B4B]">
          Ready to join?{" "}
          <a href="/seller-request" className="text-[#F39C12] hover:underline">
            Apply now
          </a>
        </p>
      </div>
    </main>
  );
}