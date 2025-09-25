import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  card: string;
  input: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Borders
  border: string;
  borderLight: string;

  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Gradients
  gradientStart: string;
  gradientEnd: string;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  input: '#FFFFFF',

  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  primary: '#8B5CF6',
  primaryLight: '#A855F7',
  primaryDark: '#7C3AED',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  gradientStart: '#FFFFFF',
  gradientEnd: '#F9FAFB',
};

const darkTheme: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  card: '#1F2937',
  input: '#1E293B',

  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',

  border: '#374151',
  borderLight: '#4B5563',

  primary: '#8B5CF6',
  primaryLight: '#A855F7',
  primaryDark: '#7C3AED',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  gradientStart: '#111827',
  gradientEnd: '#1F2937',
};

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  useEffect(() => {
    // Load system preference initially
    const systemTheme = Appearance.getColorScheme() as ThemeType;
    setThemeState(systemTheme || 'light');
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
