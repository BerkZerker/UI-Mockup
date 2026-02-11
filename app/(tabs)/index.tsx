import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, PartyPopper } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { getHabitColor } from '../../src/theme/palette';
import { useAppState } from '../../src/state';
import { Habit } from '../../src/types';
import { getToday, getDayOfWeek } from '../../src/utils/dates';
import { getFrequencyLabel } from '../../src/utils/streaks';
import { triggerHaptic, isMilestone, getMilestoneMessage } from '../../src/utils/haptics';
import { ProgressBar, FAB, MilestoneCelebration } from '../../src/components';
import { HabitFormSheet } from '../../src/components/habit-form/HabitFormSheet';

export default function TodayScreen() {
  const { theme, accent } = useTheme();
  const { habits, completions, addHabit, updateHabit, toggleHabitCompletion, getHabitStreak } = useAppState();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [celebration, setCelebration] = useState<{ message: string; color: string } | null>(null);

  const todayStr = getToday();
  const todayDow = getDayOfWeek(new Date());

  // Filter habits scheduled for today
  const todayHabits = useMemo(() => {
    return habits.filter(h => {
      if (h.archived) return false;
      if (h.selectedDays.length === 0) return true; // daily
      return h.selectedDays.includes(todayDow);
    });
  }, [habits, todayDow]);

  // Split into completed and uncompleted
  const completedToday = useMemo(() => {
    const completedIds = new Set(
      completions.filter(c => c.date === todayStr && c.status === 'completed').map(c => c.habitId)
    );
    return todayHabits.filter(h => completedIds.has(h.id));
  }, [todayHabits, completions, todayStr]);

  const uncompletedToday = useMemo(() => {
    const completedIds = new Set(
      completions.filter(c => c.date === todayStr && c.status === 'completed').map(c => c.habitId)
    );
    return todayHabits.filter(h => !completedIds.has(h.id));
  }, [todayHabits, completions, todayStr]);

  const totalCount = todayHabits.length;
  const doneCount = completedToday.length;
  const allDone = totalCount > 0 && doneCount === totalCount;

  const handleToggle = useCallback((habitId: string) => {
    toggleHabitCompletion(habitId, todayStr);
    triggerHaptic('light');

    // Check milestone after brief delay
    setTimeout(() => {
      const streak = getHabitStreak(habitId);
      const habit = habits.find(h => h.id === habitId);
      if (isMilestone(streak) && habit) {
        const color = getHabitColor(habit.colorId).primary;
        setCelebration({ message: getMilestoneMessage(streak), color });
        triggerHaptic('success');
      }
    }, 100);
  }, [toggleHabitCompletion, todayStr, getHabitStreak, habits]);

  const handleSaveHabit = useCallback((habit: Habit) => {
    if (habits.find(h => h.id === habit.id)) {
      updateHabit(habit.id, habit);
    } else {
      addHabit(habit);
    }
  }, [habits, addHabit, updateHabit]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const renderHabitItem = (habit: Habit, completed: boolean) => {
    const habitColor = getHabitColor(habit.colorId);
    const freqLabel = getFrequencyLabel(habit.selectedDays);

    return (
      <Pressable
        key={habit.id}
        onPress={() => handleToggle(habit.id)}
        style={({ pressed }) => [
          styles.habitItem,
          {
            backgroundColor: theme.bgSecondary,
            borderColor: theme.borderSubtle,
            opacity: pressed ? INTERACTIVE.pressedOpacity : completed ? 0.6 : 1,
          },
        ]}
      >
        <View style={[styles.colorDot, { backgroundColor: habitColor.primary }]} />
        <View style={styles.habitInfo}>
          <Text
            style={[
              styles.habitTitle,
              { color: theme.text },
              completed && styles.habitTitleDone,
            ]}
          >
            {habit.title}
          </Text>
          <Text style={[styles.habitFreq, { color: theme.textTertiary }]}>{freqLabel}</Text>
        </View>
        {completed ? (
          <CheckCircle2 size={26} color={accent.primary} fill={accent.primary} />
        ) : (
          <Circle size={26} color={theme.textTertiary} />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.text }]}>Scaffold</Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>{formattedDate}</Text>
      </View>

      {/* Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: theme.bgSecondary, borderColor: theme.borderSubtle }]}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Today's progress</Text>
          <Text style={[styles.progressCount, { color: theme.text }]}>
            {doneCount}
            <Text style={{ color: theme.textTertiary }}>/{totalCount}</Text>
            <Text style={[styles.progressWord, { color: theme.textTertiary }]}> completed</Text>
          </Text>
        </View>
        <View style={styles.progressBarWrap}>
          <ProgressBar value={doneCount} max={totalCount} />
        </View>
      </View>

      <FlatList
        data={uncompletedToday}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderHabitItem(item, false)}
        ListEmptyComponent={
          allDone ? (
            <View style={styles.emptyState}>
              <PartyPopper size={40} color={accent.primary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>All done for today!</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Great job completing all your habits.
              </Text>
            </View>
          ) : totalCount === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No habits scheduled</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap + to create your first habit.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          completedToday.length > 0 ? (
            <View style={styles.completedSection}>
              <Pressable
                onPress={() => setShowCompleted(!showCompleted)}
                style={styles.completedHeader}
              >
                <Text style={[styles.completedLabel, { color: theme.textTertiary }]}>
                  COMPLETED ({completedToday.length})
                </Text>
                {showCompleted
                  ? <ChevronUp size={16} color={theme.textTertiary} />
                  : <ChevronDown size={16} color={theme.textTertiary} />
                }
              </Pressable>
              {showCompleted && completedToday.map(h => renderHabitItem(h, true))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={() => setShowHabitForm(true)} />
      <HabitFormSheet
        visible={showHabitForm}
        onClose={() => setShowHabitForm(false)}
        onSave={handleSaveHabit}
      />
      {celebration && (
        <MilestoneCelebration
          message={celebration.message}
          color={celebration.color}
          visible={true}
          onDone={() => setCelebration(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
  },
  appName: {
    fontSize: FONT_SIZE['6xl'],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: FONT_SIZE.lg,
  },
  progressCard: {
    marginTop: SPACING.xl - 2,
    marginHorizontal: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: FONT_SIZE.base,
  },
  progressCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  progressWord: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.regular,
  },
  progressBarWrap: {
    marginTop: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.medium,
  },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  habitFreq: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xxs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.lg,
  },
  completedSection: {
    marginTop: SPACING.xl,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  completedLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.8,
  },
});
