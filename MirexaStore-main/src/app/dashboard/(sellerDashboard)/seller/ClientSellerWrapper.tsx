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
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = useSelector((state: any) => state.auth?.user?.role);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && role && role !== "seller") {
      router.replace("/unauthorized");
    }
  }, [isClient, role, router]);

  if (!isClient || !role) return null;

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
