import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, INTERACTIVE } from '../theme';
import { PlanDay } from '../types';
import { ProgressBar } from './ProgressBar';
import { GlassCard } from './GlassCard';

interface DayCardProps {
  day: PlanDay;
  isToday?: boolean;
  onPress?: () => void;
}

export function DayCard({ day, isToday = false, onPress }: DayCardProps) {
  const { theme, accent } = useTheme();

  return (
    <Pressable onPress={onPress} accessibilityLabel={`${day.day}, ${day.date}`} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? INTERACTIVE.pressedOpacity : 1 })}>
      <GlassCard style={styles.card} subtle={!isToday}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.dayName, { color: theme.text }]}>{day.day}</Text>
            <Text style={[styles.date, { color: theme.textTertiary }]}>{day.date}</Text>
          </View>
          <View style={styles.right}>
            {isToday && day.done > 0 ? (
              <Text style={[styles.progress, { color: accent.primary }]}>
                {day.done}/{day.tasks}
              </Text>
            ) : (
              <Text style={[styles.tasks, { color: theme.textTertiary }]}>
                {day.tasks} tasks
              </Text>
            )}
            <ChevronRight size={14} color={theme.textTertiary} />
          </View>
        </View>
        {isToday && (
          <View style={styles.progressBar}>
            <ProgressBar value={day.done} max={day.tasks} />
          </View>
        )}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.md - 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
  },
  date: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xxs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
  },
  progress: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tasks: {
    fontSize: FONT_SIZE.md,
  },
  progressBar: {
    marginTop: SPACING.md - 2,
  },
});
