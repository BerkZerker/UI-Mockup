import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Flame } from "lucide-react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../../theme";
import { getHabitColor } from "../../theme/palette";
import { GlassCard } from "../GlassCard";
import { Habit } from "../../types";

interface Props {
  habits: Habit[];
}

export function StreakLeaderboard({ habits }: Props) {
  const { theme } = useTheme();

  const sorted = useMemo(
    () => [...habits].sort((a, b) => b.streak - a.streak),
    [habits],
  );

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
        Streak Leaderboard
      </Text>

      <View style={{ gap: SPACING.sm }}>
        {sorted.map((habit, index) => {
          const color = getHabitColor(habit.colorId).primary;
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <View key={habit.id} style={styles.row}>
              <Text
                style={[
                  styles.rank,
                  {
                    color: isTop3 ? theme.accent : theme.textMuted,
                    fontWeight: isTop3
                      ? FONT_WEIGHT.bold
                      : FONT_WEIGHT.regular,
                  },
                ]}
              >
                #{rank}
              </Text>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text
                numberOfLines={1}
                style={[styles.name, { color: theme.textPrimary }]}
              >
                {habit.name}
              </Text>
              {habit.streak > 0 ? (
                <View style={styles.streakBadge}>
                  <Flame size={12} color={color} />
                  <Text
                    style={[
                      styles.streakText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {habit.streak}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.streakText, { color: theme.textMuted }]}>
                  --
                </Text>
              )}
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
  rank: {
    fontSize: FONT_SIZE.sm,
    width: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    flex: 1,
    fontSize: FONT_SIZE.base,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  streakText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
