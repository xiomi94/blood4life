import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface UserProfile {
  id: number;
  firstName?: string; // Donor
  lastName?: string; // Donor
  name?: string; // Hospital
  email: string;
  imageName?: string;
}

interface AuthContextType {
  userType: 'bloodDonor' | 'hospital' | 'admin' | null;
  user: UserProfile | null;
  login: (type: 'bloodDonor' | 'hospital' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<'bloodDonor' | 'hospital' | 'admin' | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Try BloodDonor
        const res = await axiosInstance.get('/bloodDonor/me');
        setUserType('bloodDonor');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (e) {
        try {
          // 2. Try Hospital
          const res = await axiosInstance.get('/hospital/me');
          setUserType('hospital');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (e2) {
          try {
            // 3. Try Admin
            const res = await axiosInstance.get('/admin/me');
            setUserType('admin');
            setUser(res.data);
            setIsAuthenticated(true);
          } catch (e3) {
            // No valid session found
            setIsAuthenticated(false);
            setUserType(null);
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (type: 'bloodDonor' | 'hospital' | 'admin') => {
    // Determine the endpoint based on type
    const endpoint = type === 'bloodDonor' ? '/bloodDonor/me' : type === 'hospital' ? '/hospital/me' : '/admin/me';

    // We optimistically set authenticated, but we should fetch the user details immediately
    setUserType(type);
    setIsAuthenticated(true);

    // Fetch user details
    axiosInstance.get(endpoint)
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user details on login", err));
  };

  const logout = async () => {
    try {
      await axiosInstance.get('/auth/logout');
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUserType(null);
      setUser(null);
      setIsAuthenticated(false);
      // Force reload to clear any in-memory state and redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ userType, user, login, logout, isAuthenticated, isLoading }}>
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
