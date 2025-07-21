'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './store/useAuthStore';

/**
 * Home Component - Root page that handles authentication-based routing
 * @returns {JSX.Element} Loading spinner while redirecting to appropriate page
 * 
 * Automatically redirects users based on authentication status:
 * - Authenticated users → /dashboard
 * - Unauthenticated users → /login
 */
export default function Home() {
  const router = useRouter();
  const { username } = useAuthStore();

  useEffect(() => {
    if (username) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [username, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
