import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, TrendingUp, Activity } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { getHabitColor } from '../../src/theme/palette';
import { useAppState } from '../../src/state';
import { calculateStreak, calculateCompletionRate } from '../../src/utils/streaks';
import { useHabitChartData } from '../../src/hooks/useHabitChartData';
import { ScreenHeader, GlassCard } from '../../src/components';
import { ContributionHeatmap } from '../../src/components/charts/ContributionHeatmap';
import { CompletionBarChart } from '../../src/components/charts/CompletionBarChart';
import { StreakLineChart } from '../../src/components/charts/StreakLineChart';

export default function StatsScreen() {
  const { theme, accent } = useTheme();
  const { habits, completions, getHabitStreak } = useAppState();

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Auto-select first habit if none selected
  const selectedHabit = useMemo(() => {
    if (selectedHabitId) return activeHabits.find(h => h.id === selectedHabitId);
    return activeHabits[0] ?? undefined;
  }, [activeHabits, selectedHabitId]);

  const chartData = useHabitChartData(selectedHabit, completions);
  const selectedColor = selectedHabit ? getHabitColor(selectedHabit.colorId) : null;

  // Overview stats
  const overallCompletion = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const total = activeHabits.reduce((sum, h) => sum + calculateCompletionRate(h, completions, 30), 0);
    return Math.round(total / activeHabits.length);
  }, [activeHabits, completions]);

  const bestStreak = useMemo(() => {
    return activeHabits.reduce((max, h) => Math.max(max, getHabitStreak(h.id)), 0);
  }, [activeHabits, getHabitStreak]);

  // Aggregate weekly data across all habits
  const aggregateWeekly = useMemo(() => {
    if (activeHabits.length === 0) return [];
    const today = new Date();
    const weeks: { label: string; completed: number; total: number }[] = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (w * 7 + (today.getDay() === 0 ? 6 : today.getDay() - 1)));
      let completed = 0;
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        if (day > today) continue;
        const dow = day.getDay() === 0 ? 6 : day.getDay() - 1;
        const dateStr = day.toISOString().slice(0, 10);
        for (const h of activeHabits) {
          const scheduled = h.selectedDays.length === 0 || h.selectedDays.includes(dow as any);
          if (scheduled) {
            total++;
            if (completions.find(c => c.habitId === h.id && c.date === dateStr && c.status === 'completed')) {
              completed++;
            }
          }
        }
      }
      weeks.push({ label: `W${8 - w}`, completed, total: Math.max(total, 1) });
    }
    return weeks;
  }, [activeHabits, completions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Stats" subtitle="Your habit analytics" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Card */}
        <View style={[styles.overviewCard, { backgroundColor: theme.bgSecondary, borderColor: theme.borderSubtle }]}>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <TrendingUp size={18} color={accent.primary} />
              <Text style={[styles.overviewValue, { color: theme.text }]}>{overallCompletion}%</Text>
              <Text style={[styles.overviewLabel, { color: theme.textTertiary }]}>Completion</Text>
            </View>
            <View style={styles.overviewStat}>
              <Activity size={18} color={accent.primary} />
              <Text style={[styles.overviewValue, { color: theme.text }]}>{activeHabits.length}</Text>
              <Text style={[styles.overviewLabel, { color: theme.textTertiary }]}>Active</Text>
            </View>
            <View style={styles.overviewStat}>
              <Flame size={18} color={accent.primary} />
              <Text style={[styles.overviewValue, { color: theme.text }]}>{bestStreak}d</Text>
              <Text style={[styles.overviewLabel, { color: theme.textTertiary }]}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Habit Picker */}
        {activeHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Per-habit breakdown</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerRow}
            >
              {activeHabits.map(h => {
                const hColor = getHabitColor(h.colorId);
                const isSelected = (selectedHabit?.id ?? activeHabits[0]?.id) === h.id;
                return (
                  <Pressable
                    key={h.id}
                    onPress={() => setSelectedHabitId(h.id)}
                    style={({ pressed }) => [
                      styles.pickerPill,
                      {
                        backgroundColor: isSelected ? hColor.muted : theme.pillBg,
                        opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
                      },
                    ]}
                  >
                    <View style={[styles.pickerDot, { backgroundColor: hColor.primary }]} />
                    <Text style={[styles.pickerText, { color: isSelected ? hColor.primary : theme.pillText }]}>
                      {h.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Charts for selected habit */}
            {selectedHabit && selectedColor && (
              <>
                <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>13-Week Overview</Text>
                <GlassCard style={styles.chartCard}>
                  <ContributionHeatmap
                    data={chartData.heatmapData}
                    weeks={13}
                    color={selectedColor.primary}
                    colorFaint={selectedColor.muted}
                  />
                </GlassCard>

                <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>Weekly Completion</Text>
                <GlassCard style={styles.chartCard}>
                  <CompletionBarChart data={chartData.weeklyBarData} color={selectedColor.primary} />
                </GlassCard>

                {chartData.streakData.length > 1 && (
                  <>
                    <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>Streak Trend</Text>
                    <GlassCard style={styles.chartCard}>
                      <StreakLineChart data={chartData.streakData} color={selectedColor.primary} />
                    </GlassCard>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Aggregate Weekly */}
        {aggregateWeekly.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: SPACING.xl }]}>
              All habits — weekly
            </Text>
            <GlassCard style={styles.chartCard}>
              <CompletionBarChart data={aggregateWeekly} color={accent.primary} />
            </GlassCard>
          </>
        )}

        {activeHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No habits to analyze yet. Create some habits first!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: 100,
  },
  overviewCard: {
    padding: SPACING.xl,
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  overviewValue: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  overviewLabel: {
    fontSize: FONT_SIZE.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  pickerRow: {
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  pickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  pickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pickerText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  chartTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  chartCard: {
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
});
