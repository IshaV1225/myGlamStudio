'use client';

/**
 * app/(auth)/login/page.tsx — Sign-in form.
 *
 * FLOW:
 * User submits email + password
 *   → supabase.auth.signInWithPassword() checks credentials against Supabase Auth
 *   → On success: Supabase stores a JWT token, fires onAuthStateChange in AuthContext
 *   → AuthContext sets session → AuthGuard in AppLayout now allows access
 *   → router.push('/home') navigates to the app
 *   → On failure: Supabase returns an error, we display it below the form
 *
 * LOADING STATE:
 * We disable the button and show "Signing in…" while the async call is in flight.
 * Without this, the user could click multiple times and fire duplicate requests.
 *
 * WHY useState FOR FORM FIELDS?
 * Each input is a "controlled component" — React owns the value (via useState),
 * and the input reflects it. The input's onChange updates state on every keystroke.
 * This gives us direct access to the current value at any time (e.g. on submit)
 * without having to read the DOM ourselves.
 *
 * ALTERNATIVE: Uncontrolled inputs use a ref and only read the value on submit.
 * Controlled inputs are more predictable and work better with validation.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  // Controlled form state — one useState per field
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push('/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">

        {/* App title — uses the Arcadian custom font */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl text-accent"
            style={{ fontFamily: "'Arcadian', Georgia, serif" }}
          >
            My Glam Studio
          </h1>
          <p className="text-muted mt-3 text-base">Welcome back, gorgeous.</p>
        </div>

        <div className="bg-surface rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-foreground text-2xl">Sign In</h2>

          {/* onSubmit on the <form> so pressing Enter also submits */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // controlled input
                placeholder="you@example.com"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Only rendered if there's an error — React conditionally shows this */}
            {error && <p className="text-accent text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white rounded-lg px-6 py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-primary/30" />
            <span className="text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-primary/30" />
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-bg border border-primary/40 text-foreground rounded-lg px-6 py-3 hover:border-accent/60 hover:bg-primary/10 active:scale-95 transition-all"
          >
            {/* Google G — inline SVG with official brand colours */}
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-muted text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent hover:text-accent-light transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
