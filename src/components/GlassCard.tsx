import { View, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme, RADIUS } from "../theme";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  const { theme, mode } = useTheme();

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint={mode === "dark" ? "dark" : "light"}
        style={[
          {
            borderWidth: 1,
            borderColor: theme.glassBorder,
            borderRadius: RADIUS.xl,
            overflow: "hidden",
          },
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.glassBackground,
          borderWidth: 1,
          borderColor: theme.glassBorder,
          borderRadius: RADIUS.xl,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
