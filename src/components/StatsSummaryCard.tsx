import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
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
    padding: 18,
    marginTop: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});
