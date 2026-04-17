import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";
import { AppShell } from "@/components/app-shell";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "NOVA SBE Canteen Waste Dashboard",
  description:
    "A mobile-first MVP dashboard to track canteen production, sales, waste, and menu recommendations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontSans.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
