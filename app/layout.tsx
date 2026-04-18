import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Isha's Glam Studio",
  description: "A personal makeup studio to document, organize, and showcase makeup looks, products, and mood boards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
