import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Get Linked",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col ">
        {/* TODO Toaster */}
        
        <header className="boder-b sticky top-0 bg-white z-50 shadow-md">
          <Header/>
        </header>
        <main className="bg-[#F4F2ED] flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
