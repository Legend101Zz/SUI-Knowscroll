import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SuiProvider } from "@/context/SuiContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KnowScroll - Sui Edition",
  description: "AI-Generated Educational Content on Sui Blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SuiProvider>{children}</SuiProvider>
      </body>
    </html>
  );
}
