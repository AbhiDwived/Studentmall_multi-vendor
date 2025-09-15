import Image from "next/image";
import Link from "next/link";
import SellerClientButton from "./FooterCsr";
import FooterClientLinks from "./FooterClientLinks";

const FooterSSR = () => {
  return (
    <footer className="bg-[#F6550C] text-white pt-10 pb-5 z-50">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <Link href="/" className="flex items-center min-w-[160px]">
            <Image
              src="/favicon.ico"
              alt="MirexaStore Logo"
              width={160}
              height={50}
              className="h-[48px] w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-sm leading-relaxed mt-2">
            Your one-stop solution for quality products at the best prices.
            Enjoy seamless shopping experience.
          </p>
        </div>

        {/* Customer Service + Quick Links + Socials (from client) */}
        <FooterClientLinks />

        {/* Contact Info + Seller Button */}
      </div>

      <div className="mt-10 border-t border-white pt-4 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} MirexaStore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSSR;
