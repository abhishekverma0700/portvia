import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types/portfolio';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: UserProfile = {
  id: '1',
  full_name: 'Alex Johnson',
  email: 'alex@example.com',
  username: 'alexjohnson',
  avatar_url: '',
  role: 'student',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('portvia_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = { ...MOCK_USER, email };
    setUser(u);
    localStorage.setItem('portvia_user', JSON.stringify(u));
    setIsLoading(false);
  };

  const signup = async (email: string, _password: string, fullName: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = { ...MOCK_USER, email, full_name: fullName, username: fullName.toLowerCase().replace(/\s+/g, '') };
    setUser(u);
    localStorage.setItem('portvia_user', JSON.stringify(u));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portvia_user');
    localStorage.removeItem('portvia_resume');
    localStorage.removeItem('portvia_portfolio');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
