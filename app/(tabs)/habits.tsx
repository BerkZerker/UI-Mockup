import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, getHabitColor } from '../../src/theme';
import { useHabits } from '../../src/state';

export default function HabitsScreen() {
  const { theme } = useTheme();
  const { habits } = useHabits();

  const sorted = useMemo(
    () => [...habits].sort((a, b) => b.streak - a.streak),
    [habits],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Habits</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{habits.length} tracked</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {sorted.map(habit => {
          const color = getHabitColor(habit.colorId).primary;
          return (
            <Pressable
              key={habit.id}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.glassBackground,
                  borderColor: theme.glassBorder,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.colorDot, { backgroundColor: color }]} />
              <View style={styles.cardInfo}>
                <Text style={[styles.cardName, { color: theme.textPrimary }]}>{habit.name}</Text>
                <Text style={[styles.cardTime, { color: theme.textMuted }]}>{habit.time}</Text>
              </View>
              {habit.streak > 0 && (
                <View style={[styles.streakBadge, { backgroundColor: theme.accentFaint }]}>
                  <Flame size={12} color={theme.accent} fill={theme.accent} />
                  <Text style={[styles.streakText, { color: theme.accent }]}>{habit.streak}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE['6xl'], fontWeight: FONT_WEIGHT.bold, letterSpacing: -0.5 },
  subtitle: { fontSize: FONT_SIZE.lg },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 100, gap: SPACING.sm - 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.medium },
  cardTime: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  streakText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
});
