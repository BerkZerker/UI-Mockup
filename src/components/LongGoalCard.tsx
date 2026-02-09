import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '../theme';
import { LongGoal } from '../types';
import { GlassCard } from './GlassCard';

interface LongGoalCardProps {
  goal: LongGoal;
  onPress?: () => void;
}

export function LongGoalCard({ goal, onPress }: LongGoalCardProps) {
  const { theme, accent } = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>
          <Text style={[styles.percentage, { color: theme.text }]}>{goal.pct}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: theme.pillBg,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${goal.pct}%`,
                  backgroundColor: accent.primary,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.current, { color: theme.textTertiary }]}>
            {goal.current} of {goal.target}
          </Text>
          <View style={styles.deadline}>
            <Clock size={10} color={theme.textTertiary} />
            <Text style={[styles.deadlineText, { color: theme.textTertiary }]}>
              {goal.deadline}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  percentage: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
  },
  progressBar: {
    marginTop: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  current: {
    fontSize: 12,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
  },
});
