import { create } from 'zustand';
function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp is in seconds
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

interface AuthState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  if (typeof window !== 'undefined' && token && !isTokenValid(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    token = null;
    username = null;
  }
  return {
    token,
    username,
    setAuth: (token, username) => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      set({ token, username });
    },
    signOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      set({ token: null, username: null });
    },
  };
});
