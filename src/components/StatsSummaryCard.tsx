import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme';
import { GlassCard } from './GlassCard';

interface Stat {
  label: string;
  value: string;
}

interface StatsSummaryCardProps {
  title: string;
  stats: Stat[];
}

export function StatsSummaryCard({ title, stats }: StatsSummaryCardProps) {
  const { theme } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={[styles.value, { color: theme.text }]}>{stat.value}</Text>
            <Text style={[styles.label, { color: theme.textTertiary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.xl - 2,
    marginTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg - 2,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
});
