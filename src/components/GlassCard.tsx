import { View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  subtle?: boolean;
}

export function GlassCard({ children, style, intensity = 40, subtle = false }: GlassCardProps) {
  const { theme, mode } = useTheme();

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[
          {
            borderWidth: 1,
            borderColor: theme.glassBorder,
            borderRadius: subtle ? 16 : 20,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  // Android fallback
  return (
    <View
      style={[
        {
          backgroundColor: theme.glassBg,
          borderWidth: 1,
          borderColor: theme.glassBorder,
          borderRadius: subtle ? 16 : 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
