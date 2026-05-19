'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(employeeId, password);
      router.push('/chat');
    } catch {
      // Error handled by useAuth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">AskIT Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium mb-2">
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Demo: employeeId = "demo", password = "demo123"
        </p>
      </div>
    </div>
  );
}