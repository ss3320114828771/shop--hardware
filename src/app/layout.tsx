import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";    // ← IMPORT ADD KARO
import { CartProvider } from "@/context/CartContext";    // ← IMPORT ADD KARO

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hafiz Sajid Hardware Store",                    // ← Title change karo
  description: "Your trusted hardware store since 1995",  // ← Description change karo
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-purple-950 via-blue-950 to-teal-950`}
      >
        {/* Providers - Pehle wrap karo */}
        <AuthProvider>
          <CartProvider>
            {/* Stars Background */}
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-purple-900/20"></div>
            </div>
            
            {/* Bismillah */}
            <div className="relative z-10 text-center py-6">
              <h1 className="text-5xl md:text-7xl font-arabic bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
                ﷽
              </h1>
            </div>
            
            <Navbar />
            <main className="flex-grow relative z-10 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}