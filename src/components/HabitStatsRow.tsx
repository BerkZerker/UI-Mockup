import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme';
import { GlassCard } from './GlassCard';

interface HabitStatsRowProps {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  color: string;
}

/** 3-column stats row showing streak and completion data */
export function HabitStatsRow({ currentStreak, longestStreak, completionRate, color }: HabitStatsRowProps) {
  const { theme } = useTheme();

  const stats = [
    { label: 'Current streak', value: `${currentStreak}d` },
    { label: 'Longest', value: `${longestStreak}d` },
    { label: 'Completion', value: `${completionRate}%` },
  ];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        {stats.map((stat, i) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={[styles.value, { color }]}>{stat.value}</Text>
            <Text style={[styles.label, { color: theme.textTertiary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xxs,
  },
});
