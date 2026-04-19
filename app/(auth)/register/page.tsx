'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with Firebase / Supabase auth call
      if (name.trim()) updateProfile({ name: name.trim(), email: email.trim() });
      router.push('/onboarding');
    } catch {
      setError('Something went wrong. Please try again.');
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
            Isha&apos;s Glam Studio
          </h1>
          <p className="text-muted mt-3 text-base">Start your beauty journey.</p>
        </div>

        <div className="bg-surface rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-foreground text-2xl">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-muted text-sm" htmlFor="confirm">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-primary rounded-lg px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-accent text-sm">{error}</p>
            )}

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
            <Link
              href="/login"
              className="text-accent hover:text-accent-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
