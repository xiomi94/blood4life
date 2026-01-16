import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { DELAYS, AUTH_ENDPOINTS, ROUTES } from '../constants/app.constants';
import { getUserEndpoint } from '../utils/userTypeDetector';
import { saveUserType, getSavedUserType, clearAuthData } from '../utils/authPersistence';
import { logError } from '../utils/errorHandler';
import type { UserProfile, UserType } from '../types/common.types';

// ========================================
// Types
// ========================================

interface AuthContextType {
  userType: UserType | null;
  user: UserProfile | null;
  login: (type: UserType) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ========================================
// Context
// ========================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// Provider
// ========================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Limpia el estado de autenticación
   */
  const clearAuthState = (): void => {
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
  };

  /**
   * Establece el estado de autenticación exitosa
   */
  const setAuthenticatedState = (type: UserType, userProfile: UserProfile): void => {
    setUserType(type);
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  /**
   * Obtiene los datos del usuario desde el servidor
   */
  const fetchUserProfile = async (type: UserType): Promise<UserProfile | null> => {
    try {
      const endpoint = getUserEndpoint(type);
      const response = await axiosInstance.get<UserProfile>(endpoint);
      return response.data;
    } catch (error) {
      logError(error, 'fetchUserProfile', { userType: type });
      return null;
    }
  };

  /**
   * Verifica si el usuario sigue logueado al recargar la página
   */
  const refreshUser = async (): Promise<void> => {
    const savedUserType = getSavedUserType();

    if (!savedUserType) {
      clearAuthState();
      return;
    }

    const userProfile = await fetchUserProfile(savedUserType);

    if (userProfile) {
      setAuthenticatedState(savedUserType, userProfile);
    } else {
      clearAuthState();
      clearAuthData();
    }
  };

  /**
   * Inicializa el estado de autenticación al montar el componente
   */
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Maneja el login del usuario
   * Establece el estado y recupera los datos del servidor después de un delay
   * para permitir que la cookie se propague
   */
  const login = (type: UserType): void => {
    // Establecer estado optimista
    setUserType(type);
    setIsAuthenticated(true);
    saveUserType(type);

    // Esperar a que la cookie se establezca antes de obtener los datos del usuario
    setTimeout(async () => {
      const userProfile = await fetchUserProfile(type);

      if (userProfile) {
        setUser(userProfile);
      } else {
        logError(new Error('Failed to fetch user profile'), 'login', { userType: type });
      }
    }, DELAYS.COOKIE_PROPAGATION_MS);
  };

  /**
   * Maneja el logout del usuario
   * Limpia el estado local y redirige al login
   */
  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.get(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      logError(error, 'logout');
    } finally {
      clearAuthState();
      clearAuthData();
      // Forzar recarga para limpiar cualquier estado en memoria
      window.location.href = ROUTES.LOGIN;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        user,
        login,
        logout,
        refreshUser,
        isAuthenticated,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// Hook
// ========================================

/**
 * Hook para acceder al contexto de autenticación
 * Lanza un error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
