"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SellerSidebar from "./components/SellerSidebar";
import SellerNavbar from "./components/SellerNavbar";

export default function ClientSellerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = useSelector((state: any) => state.auth?.user?.role);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && role && role !== "seller") {
      router.replace("/unauthorized");
    }
  }, [mounted, role, router]);

  if (!mounted) {
    return null;
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access this page.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 bg-[#F6550C] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-0">
      <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64">
        <SellerNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-grow pt-[60px] min-w-0 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
