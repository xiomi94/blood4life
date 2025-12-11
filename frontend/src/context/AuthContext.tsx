import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface BloodType {
  id: number;
  type: string;
}

interface UserProfile {
  id: number;
  // Blood Donor fields
  firstName?: string;
  lastName?: string;
  dni?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodType?: BloodType;
  // Hospital fields
  name?: string;
  cif?: string;
  address?: string;
  // Common fields
  email: string;
  phoneNumber?: string;
  imageName?: string;
  bloodType?: {
    id: number;
    name: string;
  };
  dni?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  cif?: string;
  address?: string;
}

interface AuthContextType {
  userType: 'bloodDonor' | 'hospital' | 'admin' | null;
  user: UserProfile | null;
  login: (type: 'bloodDonor' | 'hospital' | 'admin') => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
        // Try BloodDonor first
        const res = await axiosInstance.get('/bloodDonor/me');
        setUserType('bloodDonor');
        setUser(res.data);
        setIsAuthenticated(true);
        setIsLoading(false);
        return; // Exit early on success
      } catch (donorError: any) {
        // Only log if it's NOT an authentication error (401/403)
        if (donorError.response?.status !== 401 && donorError.response?.status !== 403) {
          console.error('Unexpected error checking blood donor auth:', donorError);
        }
      }

      try {
        // Try Hospital
        const res = await axiosInstance.get('/hospital/me');
        setUserType('hospital');
        setUser(res.data);
        setIsAuthenticated(true);
        setIsLoading(false);
        return; // Exit early on success
      } catch (hospitalError: any) {
        // Only log if it's NOT an authentication error (401/403)
        if (hospitalError.response?.status !== 401 && hospitalError.response?.status !== 403) {
          console.error('Unexpected error checking hospital auth:', hospitalError);
        }
      }

      try {
        // Try Admin
        const res = await axiosInstance.get('/admin/me');
        setUserType('admin');
        setUser(res.data);
        setIsAuthenticated(true);
        setIsLoading(false);
        return; // Exit early on success
      } catch (adminError: any) {
        // Only log if it's NOT an authentication error (401/403)
        if (adminError.response?.status !== 401 && adminError.response?.status !== 403) {
          console.error('Unexpected error checking admin auth:', adminError);
        }
      }

      // If all checks failed, user is not authenticated
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
      setIsLoading(false);
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
    <AuthContext.Provider value={{ userType, user, login, logout, refreshUser, isAuthenticated, isLoading }}>
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
