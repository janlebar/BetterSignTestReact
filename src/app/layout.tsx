import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts
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

// Define page metadata
export const metadata: Metadata = {
  title: "PDF Modifier",
  description: "A PDF modification tool built with Next.js and pdf-lib",
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <main className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-white rounded shadow-lg">
          {children}
        </main>
      </body>
    </html>
  );
}
