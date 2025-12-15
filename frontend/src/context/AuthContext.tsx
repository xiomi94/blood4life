import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';



interface UserProfile {
  id: number;
  // Blood Donor fields
  firstName?: string;
  lastName?: string;
  // Hospital fields
  name?: string;
  // Common fields
  email: string;
  imageName?: string;
  bloodType?: {
    id: number;
    type: string;
  };
  dni?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  cif?: string;
  address?: string;
  postalCode?: string;
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

  const refreshUser = async () => {
    // Get the last known user type from localStorage
    const savedUserType = localStorage.getItem('userType') as 'bloodDonor' | 'hospital' | 'admin' | null;

    // If there's no saved user type, skip verification (user is not logged in)
    if (!savedUserType) {
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
      return;
    }

    // Only check the saved user type first, then fallback to others if it fails
    const checkOrder: Array<'bloodDonor' | 'hospital' | 'admin'> = [
      savedUserType,
      ...(['bloodDonor', 'hospital', 'admin'].filter(t => t !== savedUserType) as Array<'bloodDonor' | 'hospital' | 'admin'>)
    ];

    for (const type of checkOrder) {
      try {
        const endpoint = type === 'bloodDonor' ? '/bloodDonor/me' : type === 'hospital' ? '/hospital/me' : '/admin/me';
        const res = await axiosInstance.get(endpoint);

        setUserType(type);
        setUser(res.data);
        setIsAuthenticated(true);
        localStorage.setItem('userType', type); // Save for next time
        return; // Success, stop checking
      } catch (error: any) {
        // Only log unexpected errors (not 401/403 which are expected)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error(`Unexpected error checking ${type} auth:`, error);
        }
        // Continue to next type
      }
    }

    // If all checks failed, clear everything
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
    localStorage.removeItem('userType');
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (type: 'bloodDonor' | 'hospital' | 'admin') => {
    // Determine the endpoint based on type
    const endpoint = type === 'bloodDonor' ? '/bloodDonor/me' : type === 'hospital' ? '/hospital/me' : '/admin/me';

    // We optimistically set authenticated, but we should fetch the user details immediately
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('userType', type); // Save user type

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
      localStorage.removeItem('userType'); // Clear saved type
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
