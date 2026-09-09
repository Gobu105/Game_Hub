import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameHub | We make small games & apps",
  description: "A showcase of small games, apps, and stupid ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-gray-800 bg-gray-950 py-8 mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} GameHub. Built with Next.js.</p>
        </footer>
      </body>
    </html>
  );
}
