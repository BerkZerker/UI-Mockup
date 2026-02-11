import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCENT, THEMES } from './colors';
import { ThemeMode, ThemeColors, AccentColors } from '../types';

const THEME_STORAGE_KEY = '@scaffold/themeMode';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeColors;
  accent: AccentColors;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/** Provides theme context with persistent dark/light mode */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Load saved theme on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    }).catch(() => {});
  }, []);

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  };

  const value: ThemeContextValue = {
    mode,
    theme: THEMES[mode],
    accent: ACCENT,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Access the theme context. Must be used within ThemeProvider. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
