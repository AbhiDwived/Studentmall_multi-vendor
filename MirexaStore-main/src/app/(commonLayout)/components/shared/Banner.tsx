import React from "react";
import Image from "next/image";
import ShinyText from "../reactbit/ShinyText/ShinyText";
import { Link } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <div className="relative bg-gray-900">
      {/* Background image */}
      <img
        src="https://res.cloudinary.com/dwg8d0bfp/image/upload/v1746954223/arrangement-black-friday-shopping-carts-with-copy-space-23-2148667047_hlwc79.jpg"
        alt="Shopping Carts"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          Smart Shopping Starts at{" "}
          <span className="text-[#F6550C]">MirexaStore</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Discover gadgets, gear, and everyday essentials — all in one trusted
          destination. Enjoy fast delivery, fair prices, and a future-ready
          shopping experience.
        </p>
        <a
          href="/products"
          className="inline-block bg-[#F6550C] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          <ShinyText
            text="Shop Now"
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </a>
      </div>
    </div>
  );
};

export default Banner;
