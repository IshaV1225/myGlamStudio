/**
 * app/(auth)/layout.tsx — Layout for login, register, and onboarding pages.
 *
 * ROUTE GROUPS — WHY THE PARENTHESES?
 * Folders named with parentheses like `(auth)` are "route groups" in Next.js.
 * They group files together for organisational purposes WITHOUT adding a URL
 * segment. So `app/(auth)/login/page.tsx` maps to `/login`, not `/auth/login`.
 *
 * This lets us have two different layouts:
 *   (auth)/layout.tsx  → no NavBar, no auth check (login/register/onboarding)
 *   (app)/layout.tsx   → has NavBar, has auth guard (all app pages)
 *
 * This layout is intentionally minimal — just passes children through.
 * The auth pages handle their own styling (centered form, gradient background, etc.)
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
