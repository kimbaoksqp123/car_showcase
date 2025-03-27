import type { Metadata } from "next";
import { Navbar, Footer } from "@/components";
import "./globals.css";
import { Providers } from '@/lib/providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Car Hub",
  description: "Discover the best cars in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="relative"
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
