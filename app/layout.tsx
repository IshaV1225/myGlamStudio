/**
 * app/layout.tsx — Root layout. Wraps every single page in the app.
 *
 * HOW NEXT.JS APP ROUTER LAYOUTS WORK:
 * Every folder in `app/` can have a layout.tsx. The root one (this file) is
 * the outermost shell. The <html> and <body> tags live here — they must only
 * appear once in the entire app, and this is the right place for them.
 *
 * Nested layouts (like app/(app)/layout.tsx) are rendered *inside* this one,
 * giving you a Russian-doll structure:
 *   RootLayout → AppLayout → Page
 *
 * PROVIDER ORDER MATTERS:
 * AuthProvider wraps UserProvider because UserProvider (in the future) will
 * need to know who is logged in to fetch the correct profile. Outer providers
 * are available to everything inside them.
 *
 * WHY NOT PUT ALL PROVIDERS HERE?
 * LooksProvider, ProductsProvider, MoodBoardProvider are in (app)/layout.tsx,
 * not here. They're only needed inside the app — login and onboarding pages
 * don't need looks data. Keeping them lower in the tree means they only mount
 * when actually needed.
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";

// Metadata is picked up by Next.js and injected into the <head> as <title> and <meta>.
// This is the default — individual pages can override it with their own metadata export.
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
        {/* AuthProvider: tracks the Supabase session (logged in or not) */}
        <AuthProvider>
          {/* UserProvider: tracks the user's profile (name, skin type, etc.) */}
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
