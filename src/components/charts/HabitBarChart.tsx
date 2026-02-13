import { View, Text, StyleSheet } from "react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../../theme";
import { getHabitColor } from "../../theme/palette";
import { GlassCard } from "../GlassCard";
import { HabitCompletionRate } from "../../data/mockStats";

interface Props {
  data: HabitCompletionRate[];
}

export function HabitBarChart({ data }: Props) {
  const { theme } = useTheme();

  return (
    <GlassCard style={{ padding: SPACING.xl }}>
      <Text
        style={{
          fontSize: FONT_SIZE.lg,
          fontWeight: FONT_WEIGHT.semibold,
          color: theme.textPrimary,
          marginBottom: SPACING.md,
        }}
      >
        Completion Rates
      </Text>

      <View style={{ gap: SPACING.sm }}>
        {data.map((item) => {
          const color = getHabitColor(item.colorId).primary;
          return (
            <View key={item.habitId} style={styles.row}>
              <Text
                numberOfLines={1}
                style={[styles.label, { color: theme.textSecondary }]}
              >
                {item.name}
              </Text>
              <View
                style={[
                  styles.track,
                  { backgroundColor: theme.borderSubtle },
                ]}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${item.rate * 100}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.pct, { color: theme.textMuted }]}>
                {Math.round(item.rate * 100)}%
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    width: 100,
  },
  track: {
    flex: 1,
    height: 16,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  bar: {
    height: 16,
    borderRadius: RADIUS.sm,
  },
  pct: {
    fontSize: FONT_SIZE.sm,
    width: 32,
    textAlign: "right",
  },
});
