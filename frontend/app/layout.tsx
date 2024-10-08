import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kronikarz",
  description: "Aplikacja do tworzenia drzew genealogicznych",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // const isAuthenticated = false;

  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full h-14 flex items-center px-8">
            <div className="flex items-center space-x-2">
              <BookOpen />
              <span className="text-2xl font-semibold tracking-tight">
                Kronikarz
              </span>
            </div>
            <div className="flex flex-1 md:justify-end">
              <Link href="/login">Zaloguj / Zarejestruj</Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
