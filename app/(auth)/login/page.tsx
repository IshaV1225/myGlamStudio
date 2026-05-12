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
  const [error,    setError]    = useState('');   // displayed below the form on failure
  const [loading,  setLoading]  = useState(false); // disables the submit button during the call

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault(); // prevents the form's default browser submit (full page reload)
    setError('');       // clear any previous error
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError; // jump to catch block if Supabase returned an error
      router.push('/home');
    } catch (err: unknown) {
      // err.message contains Supabase's human-readable error (e.g. "Invalid login credentials")
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false); // always re-enable the button, whether success or failure
    }
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
