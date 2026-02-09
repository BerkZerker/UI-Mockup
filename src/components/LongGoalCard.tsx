import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../theme';
import { LongGoal } from '../types';
import { GlassCard } from './GlassCard';

interface LongGoalCardProps {
  goal: LongGoal;
  onPress?: () => void;
}

export function LongGoalCard({ goal, onPress }: LongGoalCardProps) {
  const { theme, accent } = useTheme();

  return (
    <Pressable onPress={onPress} accessibilityLabel={`${goal.title}, ${goal.percent}% complete`} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? INTERACTIVE.pressedOpacity : 1 })}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>
          <Text style={[styles.percentage, { color: theme.text }]}>{goal.percent}%</Text>
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
                  width: `${goal.percent}%`,
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
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    flex: 1,
  },
  percentage: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.md,
  },
  progressBar: {
    marginTop: SPACING.md,
  },
  progressTrack: {
    height: 6,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md - 2,
  },
  current: {
    fontSize: FONT_SIZE.md,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  deadlineText: {
    fontSize: FONT_SIZE.md,
  },
});
