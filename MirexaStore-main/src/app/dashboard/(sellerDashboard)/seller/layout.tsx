import FooterSSR from "@/app/(commonLayout)/components/shared/Footer";
import ClientSellerWrapper from "./ClientSellerWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientSellerWrapper>{children}</ClientSellerWrapper>
      {/* <FooterSSR></FooterSSR> */}
    </div>
  );
}
