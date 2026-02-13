import { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../src/theme";
import { useHabits } from "../../src/state";
import {
  ProgressRing,
  HabitCard,
  ProgressBar,
  AggregateWeeklyHeatmap,
} from "../../src/components";

export default function TodayScreen() {
  const { theme } = useTheme();
  const { habits, toggleHabit } = useHabits();

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits],
  );

  const aggregateWeekly = useMemo(() => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const completed = habits.filter((h) => h.weekly[dayIndex] > 0).length;
      return habits.length > 0 ? completed / habits.length : 0;
    });
  }, [habits]);

  const formattedDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* FIXED: Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.dayLabel, { color: theme.textMuted }]}>
            {formattedDay}
          </Text>
          <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
            {formattedDate}
          </Text>
        </View>
        <ProgressRing completed={completedCount} total={habits.length} />
      </View>

      {/* FIXED: Stats Pane */}
      <View style={styles.statsPane}>
        <ProgressBar completed={completedCount} total={habits.length} />
        <AggregateWeeklyHeatmap data={aggregateWeekly} />
      </View>

      {/* SCROLLABLE: Only habit cards */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Today's habits
          </Text>
        </View>

        {habits.map((habit, index) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={toggleHabit}
            index={index}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  statsPane: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
});
