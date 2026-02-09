import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme';
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
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
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
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progress: {
    fontSize: 12,
    fontWeight: '600',
  },
  tasks: {
    fontSize: 12,
  },
  progressBar: {
    marginTop: 10,
  },
});
