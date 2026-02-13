import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme, FONT_SIZE, FONT_WEIGHT } from "../theme";

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

const STROKE = 2.5;

export function ProgressRing({
  completed,
  total,
  size = 38,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const r = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = total > 0 ? (completed / total) * circumference : 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={theme.borderSubtle}
          strokeWidth={STROKE}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={theme.accent}
          strokeWidth={STROKE}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          {completed}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});
