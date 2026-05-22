import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isLoggedIn } from '../lib/auth';
import { getMe } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage / validate token
  useEffect(() => {
    const init = async () => {
      if (isLoggedIn()) {
        // Try stored user first (fast), then verify with server
        const cached = getStoredUser();
        if (cached) setUser(cached);
        try {
          const me = await getMe();
          setUser(me);
          setStoredUser(me);
        } catch {
          // Token invalid or expired
          removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback((tokenResponse) => {
    setToken(tokenResponse.access_token);
    setStoredUser(tokenResponse.user);
    setUser(tokenResponse.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
