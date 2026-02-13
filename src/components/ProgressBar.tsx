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
    widthAnim.setValue(0);
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const allDone = total > 0 && completed === total;

  const interpolatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {allDone
          ? "All done!"
          : `${completed} of ${total} completed`}
      </Text>
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
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.xs,
  },
  track: {
    width: "100%",
    height: 12,
    borderRadius: RADIUS.full,
  },
  fill: {
    height: 12,
    borderRadius: RADIUS.full,
  },
});
