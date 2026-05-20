'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing out...</p>
    </div>
  );
}