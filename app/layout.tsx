import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";

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
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
