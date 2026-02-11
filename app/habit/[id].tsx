import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Pencil, Check, Minus, AlertCircle } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { getHabitColor } from '../../src/theme/palette';
import { useAppState } from '../../src/state';
import { Habit, CompletionStatus } from '../../src/types';
import { formatDate } from '../../src/utils/dates';
import { calculateStreak, calculateLongestStreak, calculateCompletionRate } from '../../src/utils/streaks';
import { useHabitChartData } from '../../src/hooks/useHabitChartData';
import { GlassCard } from '../../src/components';
import { HabitHeroCard } from '../../src/components/HabitHeroCard';
import { HabitStatsRow } from '../../src/components/HabitStatsRow';
import { ContributionHeatmap } from '../../src/components/charts/ContributionHeatmap';
import { StreakLineChart } from '../../src/components/charts/StreakLineChart';
import { CompletionBarChart } from '../../src/components/charts/CompletionBarChart';
import { HabitFormSheet } from '../../src/components/habit-form/HabitFormSheet';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HabitDetailScreen() {
  const { theme, accent } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits, completions, toggleHabitCompletion, updateHabit, deleteHabit, getHabitWeek } = useAppState();
  const [showEditForm, setShowEditForm] = useState(false);

  const habit = habits.find(h => h.id === String(id));
  const habitColor = habit ? getHabitColor(habit.colorId) : null;
  const weekStatuses = habit ? getHabitWeek(habit.id) : [];
  const chartData = useHabitChartData(habit, completions);

  const currentStreak = habit ? calculateStreak(habit, completions) : 0;
  const longestStreak = habit ? calculateLongestStreak(habit, completions) : 0;
  const completionRate = habit ? calculateCompletionRate(habit, completions) : 0;

  const handleToggleDay = useCallback((dayIndex: number) => {
    if (!habit) return;
    const today = new Date();
    const jsDay = today.getDay();
    const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dayIndex);
    toggleHabitCompletion(habit.id, formatDate(targetDate));
  }, [habit, toggleHabitCompletion]);

  const handleSkipDay = useCallback((dayIndex: number) => {
    if (!habit) return;
    const today = new Date();
    const jsDay = today.getDay();
    const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dayIndex);
    toggleHabitCompletion(habit.id, formatDate(targetDate), 'skipped');
  }, [habit, toggleHabitCompletion]);

  const handleSaveEdit = useCallback((updatedHabit: Habit) => {
    updateHabit(updatedHabit.id, updatedHabit);
  }, [updateHabit]);

  const handleArchive = () => {
    if (!habit) return;
    Alert.alert('Archive Habit', `Archive "${habit.title}"? It will be hidden from your main views.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        onPress: () => {
          updateHabit(habit.id, { archived: true });
          router.back();
        },
      },
    ]);
  };

  const handleDelete = () => {
    if (!habit) return;
    Alert.alert('Delete Habit', `Permanently delete "${habit.title}" and all its data? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteHabit(habit.id);
          router.back();
        },
      },
    ]);
  };

  if (!habit || !habitColor) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
          >
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <AlertCircle size={40} color={theme.textTertiary} />
            <Text style={[styles.errorTitle, { color: theme.text }]}>Habit not found</Text>
            <Text style={[styles.errorDescription, { color: theme.textTertiary }]}>
              This habit may have been removed or doesn't exist.
            </Text>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.errorButton,
                {
                  backgroundColor: accent.primary,
                  opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
                },
              ]}
            >
              <Text style={styles.errorButtonText}>Go back</Text>
            </Pressable>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
          ]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Details</Text>
        <Pressable
          onPress={() => setShowEditForm(true)}
          accessibilityLabel="Edit habit"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.editButton,
            { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
          ]}
        >
          <Pencil size={20} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <HabitHeroCard habit={habit} />

        {/* Stats Row */}
        <View style={styles.section}>
          <HabitStatsRow
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            completionRate={completionRate}
            color={habitColor.primary}
          />
        </View>

        {/* This Week */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>This Week</Text>
          <GlassCard style={styles.weekCard}>
            <View style={styles.daysGrid}>
              {WEEKDAYS.map((day, index) => {
                const status = weekStatuses[index];
                return (
                  <View key={index} style={styles.dayColumn}>
                    <Text style={[styles.dayName, { color: theme.textTertiary }]}>{day}</Text>
                    <Pressable
                      onPress={() => handleToggleDay(index)}
                      onLongPress={() => handleSkipDay(index)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: status === 'completed' }}
                      style={({ pressed }) => [
                        styles.dayButton,
                        { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
                      ]}
                    >
                      <View
                        style={[
                          styles.dayBox,
                          {
                            backgroundColor: status === 'completed'
                              ? habitColor.primary
                              : status === 'skipped'
                                ? habitColor.faint
                                : theme.pillBg,
                            borderWidth: status ? 0 : 2,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        {status === 'completed' && <Check size={20} color="#fff" strokeWidth={3} />}
                        {status === 'skipped' && <Minus size={16} color={habitColor.primary} strokeWidth={2.5} />}
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </View>

        {/* Heatmap */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>13-Week Overview</Text>
          <GlassCard style={styles.chartCard}>
            <ContributionHeatmap
              data={chartData.heatmapData}
              weeks={13}
              color={habitColor.primary}
              colorFaint={habitColor.muted}
            />
          </GlassCard>
        </View>

        {/* Streak Line Chart */}
        {chartData.streakData.length > 1 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Streak Trend</Text>
            <GlassCard style={styles.chartCard}>
              <StreakLineChart data={chartData.streakData} color={habitColor.primary} />
            </GlassCard>
          </View>
        )}

        {/* Weekly Completion Bar Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Weekly Completion</Text>
          <GlassCard style={styles.chartCard}>
            <CompletionBarChart data={chartData.weeklyBarData} color={habitColor.primary} />
          </GlassCard>
        </View>

        {/* Target Progress */}
        {habit.targetValue != null && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Target</Text>
            <GlassCard style={styles.targetCard}>
              <Text style={[styles.targetText, { color: theme.text }]}>
                {habit.targetValue} {habit.targetUnit || ''}
              </Text>
            </GlassCard>
          </View>
        )}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>Manage</Text>
          <Pressable
            onPress={handleArchive}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.dangerButton,
              {
                backgroundColor: theme.pillBg,
                opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
              },
            ]}
          >
            <Text style={[styles.dangerButtonText, { color: theme.textSecondary }]}>Archive Habit</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.dangerButton,
              {
                backgroundColor: theme.danger + '18',
                opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
              },
            ]}
          >
            <Text style={[styles.dangerButtonText, { color: theme.danger }]}>Delete Habit</Text>
          </Pressable>
        </View>
      </ScrollView>

      <HabitFormSheet
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSave={handleSaveEdit}
        editHabit={habit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.md,
  },
  weekCard: {
    padding: SPACING.xl,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  dayName: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  dayButton: {
    padding: SPACING.xs,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCard: {
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  targetCard: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  targetText: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  dangerSection: {
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
  },
  dangerButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dangerButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.medium,
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  errorCard: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  errorTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  errorDescription: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
  },
  errorButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#fff',
  },
});
