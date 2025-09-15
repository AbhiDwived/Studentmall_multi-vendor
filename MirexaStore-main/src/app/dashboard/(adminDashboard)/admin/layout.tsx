import FooterSSR from "@/app/(commonLayout)/components/shared/Footer";
import ClientAdminWrapper from "./ClientAdminWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientAdminWrapper>{children}</ClientAdminWrapper>
      {/* <FooterSSR></FooterSSR> */}
    </div>
  );
}
