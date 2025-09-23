import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./__navigation_bar/NavigationBar";
import Footer from "./__footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartSched - Intelligent Activity Scheduling",
  description: "Effortless time management with intelligent activity scheduling. Designed for clarity and focus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <NavigationBar />
        <main className="flex-1 pt-28">
          <div className="zen-animation-fade-in">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
