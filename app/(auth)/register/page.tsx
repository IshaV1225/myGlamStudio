'use client';

/**
 * app/(auth)/register/page.tsx — Account creation form.
 *
 * FLOW:
 * User submits name + email + password + confirm
 *   → Client-side validation (passwords match, length ≥ 6)
 *   → supabase.auth.signUp() creates a new Auth user in Supabase
 *   → options.data.name stores the name in Supabase's user metadata
 *   → updateProfile() saves name + email to UserContext (for the NavBar title)
 *   → router.push('/onboarding') starts the profile setup quiz
 *
 * CLIENT-SIDE VALIDATION vs SERVER-SIDE:
 * We check passwords match before hitting Supabase — this saves a network round
 * trip for a simple check the server can't do (comparing two fields the user typed).
 * Supabase still enforces its own rules server-side (e.g. password length, unique email).
 *
 * WHY PASS name IN options.data?
 * Supabase Auth stores the email + hashed password. options.data is a JSON blob
 * for any extra metadata you want attached to the auth record. We store name here
 * so it's available even before we create a row in the profiles table.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile } = useUser(); // used to pre-populate the UserContext immediately

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');

    // Client-side validation — checked before any network call
    if (password !== confirm) {
      setError('Passwords do not match.');
      return; // early return prevents the rest of the function from running
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim() }, // stored in Supabase user metadata
        },
      });
      if (authError) throw authError;

      // Pre-populate UserContext so the NavBar title shows the name immediately
      if (name.trim()) updateProfile({ name: name.trim(), email: email.trim() });

      // New users go to onboarding to complete their profile
      router.push('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl text-accent"
            style={{ fontFamily: "'Arcadian', Georgia, serif" }}
          >
            My Glam Studio
          </h1>
          <p className="text-muted mt-3 text-base">Start your beauty journey.</p>
        </div>

        <div className="bg-surface rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-foreground text-2xl">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="name">Name</label>
              <input
                id="name" type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="email">Email</label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="password">Password</label>
              <input
                id="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm" type="password" required
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && <p className="text-accent text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white rounded-lg px-6 py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-muted text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:text-accent-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
