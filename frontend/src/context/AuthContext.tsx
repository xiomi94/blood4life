import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface AuthContextType {
  userType: 'bloodDonor' | 'hospital' | null;
  login: (type: 'bloodDonor' | 'hospital') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<'bloodDonor' | 'hospital' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch donor profile
        await axiosInstance.get('/bloodDonor/me');
        setUserType('bloodDonor');
        setIsAuthenticated(true);
      } catch (e) {
        // If failed, try hospital (assuming you have a similar endpoint, or just fail)
        // For now, we'll assume if donor fails, we are not logged in or try hospital
        // TODO: Add /hospital/me endpoint to backend if needed for strict checking
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (type: 'bloodDonor' | 'hospital') => {
    setUserType(type);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // TODO: Call backend logout endpoint to clear cookie
    setUserType(null);
    setIsAuthenticated(false);
    // Force reload to clear any in-memory state if needed
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
