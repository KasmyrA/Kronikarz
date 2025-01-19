import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  return (
    <html lang="pl" className="h-full w-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
