import { AccentColors, ThemeColors } from '../types';

// ─── Single accent: Deep Green ──────────────────────────────────────────────
export const ACCENT: AccentColors = {
  primary: '#4a8d5f',
  primaryHover: '#55a06c',
  onPrimary: '#ffffff',
  primaryFaint: 'rgba(74,141,95,0.10)',
  primaryMuted: 'rgba(74,141,95,0.22)',
  primaryGlass: 'rgba(74,141,95,0.12)',
};

// ─── Themes — lighter dark mode, frosted glass tokens ───────────────────────
// 60% dominant bg | 30% secondary/text | 10% accent
export const THEMES: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    // 60% — lifted from pure black to a softer charcoal
    bg: '#212121',
    // 30% — cards, elevated surfaces, text
    bgSecondary: '#282828',
    bgTertiary: '#303030',
    bgElevated: '#353535',
    // Glass surfaces
    glassBg: 'rgba(50,50,50,0.55)',
    glassBorder: 'rgba(255,255,255,0.08)',
    glassHighlight: 'rgba(255,255,255,0.04)',
    // Text — all pass WCAG AA on #212125
    text: '#eeeeee', // 13.8:1
    textSecondary: '#d0d0d0',
    textTertiary: '#9a9a9a',
    // Borders & UI
    border: '#3c3c3c',
    borderSubtle: '#303030',
    pillBg: 'rgba(255,255,255,0.06)',
    pillText: '#bcbcbc',
    // Semantic
    success: '#4a8d5f',
    danger: '#e05555',
  },
  light: {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    bgTertiary: '#ededed',
    bgElevated: '#ffffff',
    glassBg: 'rgba(255,255,255,0.60)',
    glassBorder: 'rgba(0,0,0,0.06)',
    glassHighlight: 'rgba(255,255,255,0.80)',
    text: '#1a1a1a',
    textSecondary: '#3a3a3a',
    textTertiary: '#606060',
    border: '#dcdcdc',
    borderSubtle: '#e8e8e8',
    pillBg: 'rgba(0,0,0,0.04)',
    pillText: '#4a4a4a',
    success: '#4a8d5f',
    danger: '#d44',
  },
};
