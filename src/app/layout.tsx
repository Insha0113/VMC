import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import WhatsAppButton from "@/components/WhatsAppButton";
import SubmitReview from "@/components/SubmitReview";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "VMC Medical Center | Clinical Excellence & Compassionate Care",
  description: "VMC Medical Center provides top-tier medical services in Orthopedics, Pediatrics, and ENT. Schedule an appointment with our expert consultants today.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} style={{ scrollBehavior: 'smooth' }}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'var(--font-inter)' }}>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>
        <Suspense fallback={null}>
          <SubmitReview />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
        <Suspense fallback={null}>
          <WhatsAppButton />
        </Suspense>
      </body>
    </html>
  );
}

