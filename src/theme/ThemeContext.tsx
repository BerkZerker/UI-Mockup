import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ACCENT, THEMES } from './colors';
import { ThemeMode, ThemeColors, AccentColors } from '../types';

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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
