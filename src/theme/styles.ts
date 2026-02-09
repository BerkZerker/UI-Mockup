import { ViewStyle } from 'react-native';
import { ThemeColors } from '../types';
import { RADIUS } from './tokens';

// ─── Shared Styles adapted for React Native ────────────────────────────────
export const glassCard = (theme: ThemeColors): ViewStyle => ({
  backgroundColor: theme.glassBg,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: RADIUS['3xl'],
});

export const glassCardSubtle = (theme: ThemeColors): ViewStyle => ({
  backgroundColor: theme.glassBg,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: RADIUS['2xl'],
});
