import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "SkillSwap – Kết nối và trao đổi kỹ năng sinh viên",
  description: "Nền tảng giúp sinh viên dạy kỹ năng mình biết và tìm người dạy kỹ năng mình cần. Kết nối, học hỏi và phát triển cùng nhau.",
  openGraph: {
    title: "SkillSwap – Trao đổi kỹ năng sinh viên",
    description: "Cộng đồng trao đổi tri thức hàng đầu dành cho sinh viên.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${jakarta.variable} font-sans`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SkillSwap",
              "applicationCategory": "EducationApplication",
              "operatingSystem": "All",
              "description": "Nền tảng trao đổi kỹ năng hàng đầu cho sinh viên Việt Nam.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "VND"
              }
            })
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Header />
        </Suspense>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
