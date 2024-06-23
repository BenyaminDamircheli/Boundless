import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Sans } from 'next/font/google';

import "./globals.css";

const notosans = Noto_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Boundless",
  description: "Quickly find what you want to learn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={notosans.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
