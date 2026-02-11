import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Repeat, Flame, Check, Minus } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';
import { getHabitColor } from '../theme/palette';
import { Habit, CompletionStatus } from '../types';
import { getFrequencyLabel } from '../utils/streaks';

interface HabitRowProps {
  habit: Habit;
  weekStatuses: (CompletionStatus | null)[];
  streak: number;
  onToggleDay: (habitId: string, dayIndex: number) => void;
  showBorder?: boolean;
}

/** A single habit row with colored day checkboxes and streak info */
export function HabitRow({ habit, weekStatuses, streak, onToggleDay, showBorder = true }: HabitRowProps) {
  const { theme } = useTheme();
  const habitColor = getHabitColor(habit.colorId);
  const freqLabel = getFrequencyLabel(habit.selectedDays);

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.borderSubtle,
        },
      ]}
    >
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <View style={[styles.colorDot, { backgroundColor: habitColor.primary }]} />
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{habit.title}</Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.freq}>
            <Repeat size={10} color={theme.textTertiary} />
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>
              {freqLabel}
            </Text>
          </View>
          {streak > 0 && (
            <View style={styles.streak}>
              <Flame size={10} color={theme.textTertiary} fill={theme.textTertiary} />
              <Text style={[styles.metaText, { color: theme.textTertiary }]}>
                {streak}d
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.week}>
        {weekStatuses.map((status, index) => (
          <Pressable
            key={index}
            onPress={() => onToggleDay(habit.id, index)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: status === 'completed' }}
            accessibilityLabel={`Day ${index + 1} ${status === 'completed' ? 'completed' : status === 'skipped' ? 'skipped' : 'not completed'}`}
            style={styles.dayButton}
          >
            <View
              style={[
                styles.dayBox,
                {
                  backgroundColor: status === 'completed'
                    ? habitColor.primary
                    : status === 'skipped'
                      ? habitColor.faint
                      : theme.pillBg,
                  borderWidth: status ? 0 : 1.5,
                  borderColor: theme.border,
                },
              ]}
            >
              {status === 'completed' && <Check size={11} color="#fff" strokeWidth={3} />}
              {status === 'skipped' && <Minus size={11} color={habitColor.primary} strokeWidth={2.5} />}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg - 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.medium,
    flexShrink: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    marginLeft: 14, // align under title (past the dot)
  },
  freq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs - 1,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs - 1,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
  },
  week: {
    flexDirection: 'row',
    gap: 0,
  },
  dayButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBox: {
    width: SPACING.xl,
    height: SPACING.xl,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
