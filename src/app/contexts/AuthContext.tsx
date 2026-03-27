import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'retailer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string, role: 'farmer' | 'retailer') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Array<User & { password: string }> = [
  {
    id: 'farmer1',
    name: 'Ramesh Kumar',
    email: 'farmer@test.com',
    phone: '9876543210',
    password: 'farmer123',
    role: 'farmer',
  },
  {
    id: 'retailer1',
    name: 'Sunil Trader',
    email: 'retailer@test.com',
    phone: '9876543211',
    password: 'retailer123',
    role: 'retailer',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(mockUsers);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('krushisevak_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('krushisevak_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'farmer' | 'retailer'
  ): boolean => {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: `${role}${Date.now()}`,
      name,
      email,
      phone,
      password,
      role,
    };

    setUsers([...users, newUser]);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krushisevak_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
