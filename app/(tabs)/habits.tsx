import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from "../../src/theme";
import { useHabits } from "../../src/state";
import {
  CompletionTrendChart,
  HabitBarChart,
  CalendarHeatmap,
  StreakLeaderboard,
} from "../../src/components/charts";
import {
  DAILY_COMPLETION_PERCENT,
  HABIT_COMPLETION_RATES,
  generateCalendarData,
} from "../../src/data/mockStats";

export default function StatsScreen() {
  const { theme } = useTheme();
  const { habits } = useHabits();
  const [timeSpan, setTimeSpan] = useState<"week" | "month" | "year">("month");

  const calendarData = generateCalendarData(2026, 2);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Stats</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chartWrap}>
          <CompletionTrendChart
            data={DAILY_COMPLETION_PERCENT}
            timeSpan={timeSpan}
            onTimeSpanChange={setTimeSpan}
          />
        </View>
        <View style={styles.chartWrap}>
          <HabitBarChart data={HABIT_COMPLETION_RATES} />
        </View>
        <View style={styles.chartWrap}>
          <CalendarHeatmap data={calendarData} maxCount={habits.length} />
        </View>
        <View style={styles.chartWrap}>
          <StreakLeaderboard habits={habits} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  chartWrap: {
    marginBottom: SPACING.xl,
  },
});
