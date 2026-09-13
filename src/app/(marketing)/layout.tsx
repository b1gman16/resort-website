import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NavSpacer } from "@/components/layout/nav-spacer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <NavSpacer />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}