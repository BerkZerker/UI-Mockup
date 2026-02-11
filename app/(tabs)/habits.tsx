import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Flame, Archive } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { getHabitColor } from '../../src/theme/palette';
import { useAppState } from '../../src/state';
import { Habit } from '../../src/types';
import { getFrequencyLabel } from '../../src/utils/streaks';
import { triggerHaptic } from '../../src/utils/haptics';
import { ScreenHeader, FAB } from '../../src/components';
import { HabitFormSheet } from '../../src/components/habit-form/HabitFormSheet';

export default function HabitsScreen() {
  const { theme, accent } = useTheme();
  const { habits, addHabit, updateHabit, getHabitStreak } = useAppState();
  const router = useRouter();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter(h => h.archived), [habits]);

  const handleSaveHabit = useCallback((habit: Habit) => {
    if (habits.find(h => h.id === habit.id)) {
      updateHabit(habit.id, habit);
    } else {
      addHabit(habit);
      triggerHaptic('medium');
    }
  }, [habits, addHabit, updateHabit]);

  const renderHabitCard = ({ item }: { item: Habit }) => {
    const habitColor = getHabitColor(item.colorId);
    const streak = getHabitStreak(item.id);
    const freqLabel = getFrequencyLabel(item.selectedDays);
    const initial = item.title.charAt(0).toUpperCase();

    return (
      <Pressable
        onPress={() => router.push(`/habit/${item.id}`)}
        style={({ pressed }) => [
          styles.habitCard,
          {
            backgroundColor: theme.bgSecondary,
            borderColor: theme.borderSubtle,
            opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
          },
        ]}
      >
        {/* Icon circle with initial */}
        <View style={[styles.iconCircle, { backgroundColor: habitColor.muted }]}>
          <Text style={[styles.iconInitial, { color: habitColor.primary }]}>{initial}</Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={[styles.cardCategory, { color: theme.textTertiary }]}>{item.category}</Text>
            <Text style={[styles.cardDot, { color: theme.textTertiary }]}> · </Text>
            <Text style={[styles.cardFreq, { color: theme.textTertiary }]}>{freqLabel}</Text>
          </View>
        </View>

        {/* Streak badge */}
        {streak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: accent.primaryFaint }]}>
            <Flame size={12} color={accent.primary} fill={accent.primary} />
            <Text style={[styles.streakText, { color: accent.primary }]}>{streak}</Text>
          </View>
        )}

        <ChevronRight size={18} color={theme.textTertiary} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Habits" subtitle={`${activeHabits.length} active habits`} />

      <FlatList
        data={activeHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabitCard}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No habits tracked yet. Tap + to create one.
            </Text>
          </View>
        }
        ListFooterComponent={
          archivedHabits.length > 0 ? (
            <View style={styles.archivedSection}>
              <Pressable
                onPress={() => setShowArchived(!showArchived)}
                style={({ pressed }) => [
                  styles.archivedToggle,
                  { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
                ]}
              >
                <Archive size={14} color={theme.textTertiary} />
                <Text style={[styles.archivedLabel, { color: theme.textTertiary }]}>
                  {showArchived ? 'Hide' : 'Show'} archived ({archivedHabits.length})
                </Text>
              </Pressable>
              {showArchived && (
                <FlatList
                  data={archivedHabits}
                  keyExtractor={(item) => item.id}
                  renderItem={renderHabitCard}
                  scrollEnabled={false}
                />
              )}
            </View>
          ) : null
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={() => setShowHabitForm(true)} />
      <HabitFormSheet
        visible={showHabitForm}
        onClose={() => setShowHabitForm(false)}
        onSave={handleSaveHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconInitial: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.medium,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xxs,
  },
  cardCategory: {
    fontSize: FONT_SIZE.md,
  },
  cardDot: {
    fontSize: FONT_SIZE.md,
  },
  cardFreq: {
    fontSize: FONT_SIZE.md,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingVertical: SPACING.xxs + 1,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  streakText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
  archivedSection: {
    marginTop: SPACING.xxl,
  },
  archivedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  archivedLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
});
