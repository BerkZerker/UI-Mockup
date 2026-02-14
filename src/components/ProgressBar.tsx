import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "../theme";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const { theme } = useTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const interpolatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {completed}
          <Text style={{ color: theme.textMuted }}> / {total}</Text>
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.borderSubtle }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: theme.accent,
              width: interpolatedWidth,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
  },
  track: {
    width: "100%",
    height: 16,
    borderRadius: RADIUS.full,
  },
  fill: {
    height: 16,
    borderRadius: RADIUS.full,
  },
});
