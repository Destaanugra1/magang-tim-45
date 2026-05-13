import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { HideOnDashboard } from "@/components/ui/navbar-wrapper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "UMKM Digital - Platform UMKM Indonesia",
  description: "Temukan dan dukung produk UMKM lokal dari seluruh Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <HideOnDashboard>
          <Navbar />
        </HideOnDashboard>
        {children}
        <HideOnDashboard>
          <Footer />
        </HideOnDashboard>
      </body>
    </html>
  );
}
