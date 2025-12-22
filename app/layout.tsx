import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Long distance & out of state Licensed insured movers quote ",
  description: "Gentle Moving",
  icons: {
    icon: "/image/mini-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
