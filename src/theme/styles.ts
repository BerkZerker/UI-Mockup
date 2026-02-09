import { ViewStyle } from 'react-native';
import { ThemeColors } from '../types';

// ─── Shared Styles adapted for React Native ────────────────────────────────
export const glassCard = (theme: ThemeColors): ViewStyle => ({
  backgroundColor: theme.glassBg,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: 20,
});

export const glassCardSubtle = (theme: ThemeColors): ViewStyle => ({
  backgroundColor: theme.glassBg,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: 16,
});
