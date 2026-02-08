import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import LiveBackground from "@/components/common/LiveBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perfect Corp AI Experience",
  description: "Immersive beauty tech experience powered by AI & AR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LiveBackground />
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
