import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';
import { getHabitColor } from '../theme/palette';
import { Habit } from '../types';
import { getFrequencyLabel } from '../utils/streaks';
import { GlassCard } from './GlassCard';

interface HabitHeroCardProps {
  habit: Habit;
}

/** Hero card showing habit icon, title, category, and frequency */
export function HabitHeroCard({ habit }: HabitHeroCardProps) {
  const { theme } = useTheme();
  const habitColor = getHabitColor(habit.colorId);
  const freq = getFrequencyLabel(habit.selectedDays);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: habitColor.muted }]}>
          <Text style={[styles.iconText, { color: habitColor.primary }]}>
            {habit.icon ? habit.icon.slice(0, 1).toUpperCase() : habit.title.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]}>{habit.title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.pill, { backgroundColor: habitColor.faint }]}>
              <Text style={[styles.pillText, { color: habitColor.primary }]}>{freq}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.pillBg }]}>
              <Text style={[styles.pillText, { color: theme.pillText }]}>{habit.category}</Text>
            </View>
          </View>
          {habit.notes ? (
            <Text style={[styles.notes, { color: theme.textTertiary }]} numberOfLines={2}>
              {habit.notes}
            </Text>
          ) : null}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.lg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    paddingVertical: SPACING.xxs + 1,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  pillText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  notes: {
    fontSize: FONT_SIZE.base,
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});
