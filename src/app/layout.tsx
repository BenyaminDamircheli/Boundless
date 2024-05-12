
import type { Metadata } from "next";
import {GeistSans} from 'geist/font/sans';
import { DM_Sans } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const geistSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={geistSans.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
