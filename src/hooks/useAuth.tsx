import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567890',
    companyId: '1',
    role: 'ADMIN',
    isManager: true,
    active: true,
  },
  {
    id: '2',
    name: 'Master User',
    email: 'master@company1.com',
    phone: '+1234567891',
    companyId: '2',
    role: 'MASTER',
    isManager: true,
    active: true,
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@company1.com',
    phone: '+1234567892',
    companyId: '2',
    role: 'USER',
    isManager: false,
    active: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate checking for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email (in real app, this would be an API call)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // In real app, we would verify password here
    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}