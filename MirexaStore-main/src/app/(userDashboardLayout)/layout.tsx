import type { Metadata } from "next";
import UserDashboardSideBar from "./component/sidebar";
import Header from "../(commonLayout)/components/shared/Header";

export const metadata: Metadata = {
  title: "Dashboard - e_commerce_web_application",
  description:
    "Welcome to e_commerce_web_application – where innovation meets imagination in the dynamic realm of technology, offering a thrilling journey through the latest trends and groundbreaking discoveries in the world of tech!",
};

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
