import { authAPI, TokenResponse } from '@/services/api';
import { User, UserRole } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: UserRole
  ) => Promise<void>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for different roles with more realistic data
const mockUsers: Record<UserRole, User> = {
  citizen: {
    id: '1',
    name: 'John Citizen',
    email: 'citizen@example.com',
    role: 'citizen',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    points: 1250,
    badgeCount: 3,
  },
  fieldworker: {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@cityservices.gov',
    role: 'fieldworker',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
  },
  staff: {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@city.gov',
    role: 'staff',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
  },
  admin: {
    id: '4',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@city.gov',
    role: 'admin',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
  },
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  citizen: [
    'report_issues',
    'view_own_reports',
    'vote_issues',
    'view_community',
  ],
  fieldworker: [
    'view_assigned_tasks',
    'update_task_status',
    'view_fieldworker_dashboard',
    'report_field_updates',
  ],
  staff: [
    'assign_tasks',
    'view_department_reports',
    'manage_team',
    'view_analytics',
    'moderate_content',
  ],
  admin: [
    'manage_users',
    'system_configuration',
    'view_all_analytics',
    'manage_policies',
    'system_admin',
  ],
} as const;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('authToken');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        // Normalize role to lowercase in case it was stored in uppercase
        const normalizedUser = {
          ...userData,
          role: userData.role.toLowerCase() as UserRole,
        };
        // In a real app, you'd validate the token with your backend
        setUser(normalizedUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid stored data
      await AsyncStorage.multiRemove(['user', 'authToken']);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const tokenData: TokenResponse = response.data;
      const { access_token, refresh_token, user } = tokenData;

      // Convert role to lowercase to match frontend expectations
      const normalizedUser = {
        ...user,
        role: user.role.toLowerCase() as UserRole,
      };

      // Store authentication data
      await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
      await AsyncStorage.setItem('authToken', access_token);
      await AsyncStorage.setItem('refreshToken', refresh_token);

      setUser(normalizedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: UserRole
  ) => {
    setIsLoading(true);

    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        phone,
        role: role || 'citizen',
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // After successful registration, automatically log in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Call logout API
      await authAPI.logout();

      // Clear local storage
      await AsyncStorage.multiRemove(['user', 'authToken', 'refreshToken']);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local data
      await AsyncStorage.multiRemove(['user', 'authToken', 'refreshToken']);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Update stored user data
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return (userPermissions as readonly string[]).includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUserRole,
        isLoading,
        checkAuth,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
