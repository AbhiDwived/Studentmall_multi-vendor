"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  // Redirect to homepage after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      {/* SVG Illustration */}

      {/* Text Content */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mt-6">
        Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        {"The page you are looking for doesn't exist or has been moved."}
      </p>

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-4">
        <Link href="/">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
            Go Home
          </button>
        </Link>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>

      {/* Auto Redirect Notice */}
      <p className="text-sm text-gray-500 mt-4">
        Redirecting to Home in 5 seconds...
      </p>
    </div>
  );
}
