import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Providers from "./lib/Providers";
import Script from "next/script";
import ClickSparkWrapper from "./(commonLayout)/components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

// const roboto = Roboto({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
// });

// const poppins = Poppins({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MirexaStore",
  description:
    "Shop smart at MirexaStore – your all-in-one destination for tech gadgets, accessories, home essentials, and lifestyle products. Fast delivery, trusted service, and quality you can count on.",
  // next.js 13+ automatically injects OG & Twitter tags from metadata on each page
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F85606" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />

        {/* Google Analytics 4 - load lazily */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RWY5TMX717"
          strategy="lazyOnload"
          async
          defer
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RWY5TMX717');
          `}
        </Script>
      </head>
      <body className={hindSiliguri.className}>
        <ClickSparkWrapper>
          <Providers>{children}</Providers>
        </ClickSparkWrapper>
      </body>
    </html>
  );
}
