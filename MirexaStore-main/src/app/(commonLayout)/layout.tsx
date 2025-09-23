import Header from "@/app/(commonLayout)/components/shared/Header";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import type { Metadata } from "next";
import ClickSparkWrapper from "./components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

export const metadata: Metadata = {
  title:
    "Studentmall | Best Online Shopping in India – Fashion, Electronics & More",
  description:
    "Buy top-quality electronics, fashion, home decor, and more online from Studentmall. Trusted online shopping in India with fast delivery, secure payment & great prices.",

  keywords: [
    "online shopping India",
    "Studentmall",
    "buy electronics online",
    "fashion store BD",
    "home essentials BD",
    "best online store India",
    "gadget store India",
    "online fashion shop BD",
  ],

  openGraph: {
    title: "Studentmall | Best Online Shopping in India",
    description:
      "Shop at MirexaStore – India’s most trusted destination for electronics, fashion, and daily essentials. Quality guaranteed. Fast shipping nationwide.",
    url: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://studentmall.com",
    siteName: "Studentmall",
    images: [
      {
        url: "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1751225263/mirexastore_dksqoq.png", // ✅ Your provided logo
        width: 800,
        height: 800,
        alt: "Studentmall Logo – Online Shopping India",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Studentmall | Trusted Online Store in India",
    description:
      "Electronics, fashion, home & lifestyle – discover everything at MirexaStore. Fast shipping, easy checkout, and amazing deals await.",
    images: [
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1751225263/mirexastore_dksqoq.png",
    ],
    creator: "@studentmall", // optional
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ClickSparkWrapper>
        <header>
          <Header />
        </header>

        <main className="flex-grow pt-[60px]" role="main">
          {children}
          <Footer></Footer>
        </main>
      </ClickSparkWrapper>
    </div>
  );
}
