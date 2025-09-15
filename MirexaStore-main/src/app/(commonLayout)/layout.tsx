import Header from "@/app/(commonLayout)/components/shared/Header";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import type { Metadata } from "next";
import ClickSparkWrapper from "./components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

export const metadata: Metadata = {
  title:
    "MirexaStore | Best Online Shopping in Bangladesh – Fashion, Electronics & More",
  description:
    "Buy top-quality electronics, fashion, home decor, and more online from MirexaStore. Trusted online shopping in Bangladesh with fast delivery, secure payment & great prices.",

  keywords: [
    "online shopping Bangladesh",
    "MirexaStore",
    "buy electronics online",
    "fashion store BD",
    "home essentials BD",
    "best online store Bangladesh",
    "gadget store Bangladesh",
    "online fashion shop BD",
  ],

  openGraph: {
    title: "MirexaStore | Best Online Shopping in Bangladesh",
    description:
      "Shop at MirexaStore – Bangladesh’s most trusted destination for electronics, fashion, and daily essentials. Quality guaranteed. Fast shipping nationwide.",
    url: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://mirexastore.com",
    siteName: "MirexaStore",
    images: [
      {
        url: "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1751225263/mirexastore_dksqoq.png", // ✅ Your provided logo
        width: 800,
        height: 800,
        alt: "MirexaStore Logo – Online Shopping Bangladesh",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "MirexaStore | Trusted Online Store in Bangladesh",
    description:
      "Electronics, fashion, home & lifestyle – discover everything at MirexaStore. Fast shipping, easy checkout, and amazing deals await.",
    images: [
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1751225263/mirexastore_dksqoq.png",
    ],
    creator: "@mirexastore", // optional
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
