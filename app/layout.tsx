import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";
import { AppShell } from "@/components/app-shell";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "TEMPERO",
  description: "TEMPERO pilot for menu planning, ordering, document capture, and canteen insight.",
  applicationName: "TEMPERO",
  appleWebApp: {
    capable: true,
    title: "TEMPERO",
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false
  }
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
