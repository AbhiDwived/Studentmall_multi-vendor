"use client";

import SplitText from "../SplitText/SplitText";
import { easings } from "@react-spring/web";
import ShinyText from "../reactbit/ShinyText/ShinyText";

const BannerContent = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto text-center">
      <h1 className="mb-3 sm:mb-4">
        <SplitText
          text="Welcome to MirexaStore"
          className="text-2xl sm:text-4xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 text-white text-center"
          delay={100}
          animationFrom={{
            opacity: 0,
            transform: "translate3d(0, 14px, 0)", // Reduced for subtlety
          }}
          animationTo={{
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          }}
          easing={easings.easeOutCubic}
          threshold={0.2}
          rootMargin="-50px"
        />
      </h1>

      <h3 className="mb-5 sm:mb-6">
        <SplitText
          text="Everything your campus life needs – one store, endless convenience."
          className="text-sm sm:text-lg lg:text-2xl font-light mb-6 sm:mb-8 text-white/80 text-center max-w-3xl mx-auto"
          delay={70}
          animationFrom={{
            opacity: 0,
            transform: "translate3d(0, 14px, 0)",
          }}
          animationTo={{
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          }}
          easing={easings.easeOutCubic}
          threshold={0.2}
          rootMargin="-50px"
        />
      </h3>

      <div className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-8">
        <a
          href="/product"
          className="inline-block px-8 sm:px-10 py-4 bg-gradient-to-r from-[#F85606] to-[#E14003] text-white rounded-full text-sm sm:text-xl font-semibold transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          <ShinyText
            text="Shop Now"
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </a>
        <a
          href="#"
          className="inline-block px-8 sm:px-10 py-4 border-2 border-white rounded-full text-sm sm:text-xl font-semibold text-white transition-transform transform hover:scale-105 hover:bg-white hover:text-[#F85606]"
        >
          Learn More
        </a>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-6 text-2xl sm:text-3xl">
        <a href="#" className="hover:text-[#F85606]">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="hover:text-[#F85606]">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="hover:text-[#F85606]">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  );
};

export default BannerContent;
