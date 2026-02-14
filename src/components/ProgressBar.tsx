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

function getMotivationalMessage(completed: number, total: number): string {
  if (total === 0) return "";
  const pct = completed / total;
  if (pct === 1) return "All done! You crushed it today.";
  if (pct >= 0.75) return "Almost there! Just a few more to go.";
  if (pct >= 0.5) return "Halfway through, keep it up!";
  if (pct > 0) return "Great start! Keep the momentum going.";
  return "Ready to start your day?";
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

  const motivationalMsg = getMotivationalMessage(completed, total);

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {completed}
          <Text style={{ color: theme.textMuted }}> / {total}</Text>
        </Text>
        <Text style={[styles.pctLabel, { color: theme.accent }]}>
          {Math.round(pct)}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.borderSubtle }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: allDone ? theme.accent : theme.accent,
              width: interpolatedWidth,
            },
          ]}
        />
      </View>
      <Text style={[styles.motivation, { color: theme.textMuted }]}>
        {motivationalMsg}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.bold,
  },
  pctLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  track: {
    width: "100%",
    height: 10,
    borderRadius: RADIUS.full,
  },
  fill: {
    height: 10,
    borderRadius: RADIUS.full,
  },
  motivation: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    marginTop: SPACING.xs + 2,
  },
});
