"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 shadow-xl-subtle">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <h1 className="text-3xl font-semibold text-neutral-50 mb-2">
              AI App Builder
            </h1>
            <p className="text-neutral-400">
              Enter password to access
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter site password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-accent-error/10 border border-accent-error/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Access App'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-neutral-500">
            🔒 Protected Site
          </div>
        </div>
      </div>
    </div>
  );
}
