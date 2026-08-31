import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const iranyekan = localFont({
  src: [
    {
      path: "../../public/fonts/iranyekan/IRANYekanXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekanXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekanXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekanXFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekanXFaNum-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "پایتینو | دستیار هوشمند فروشگاه شما",
    template: "پایتینو | %s",
  },
  description:
    "پایتینو دستیار هوش مصنوعی فروشگاه‌های اینترنتی است — محصولاتتان را می‌شناسد و به مشتری‌ها کمک می‌کند سریع‌تر جواب بگیرند و خرید کنند.",
  verification: {
    google: "T8JTrOn7ZFNDg5k2PfQumTirmtHPbB7rowgSJuul9I8",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranyekan.variable} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
