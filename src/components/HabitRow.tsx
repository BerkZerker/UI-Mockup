import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Repeat, Flame, Check } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';
import { Habit } from '../types';

interface HabitRowProps {
  habit: Habit;
  onToggleDay: (habitId: number, dayIndex: number) => void;
  showBorder?: boolean;
}

export function HabitRow({ habit, onToggleDay, showBorder = true }: HabitRowProps) {
  const { theme, accent } = useTheme();

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
        <Text style={[styles.title, { color: theme.text }]}>{habit.title}</Text>
        <View style={styles.meta}>
          <View style={styles.freq}>
            <Repeat size={10} color={theme.textTertiary} />
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>
              {habit.frequency}
            </Text>
          </View>
          {habit.streak > 0 && (
            <View style={styles.streak}>
              <Flame size={10} color={theme.textTertiary} fill={theme.textTertiary} />
              <Text style={[styles.metaText, { color: theme.textTertiary }]}>
                {habit.streak}d
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.week}>
        {habit.week.map((done, index) => (
          <Pressable
            key={index}
            onPress={() => onToggleDay(habit.id, index)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!done }}
            accessibilityLabel={`Day ${index + 1} ${done ? 'completed' : 'not completed'}`}
            style={styles.dayButton}
          >
            <View
              style={[
                styles.dayBox,
                {
                  backgroundColor: done ? accent.primary : theme.pillBg,
                  borderWidth: done ? 0 : 1.5,
                  borderColor: theme.border,
                },
              ]}
            >
              {done === 1 ? <Check size={11} color="#fff" strokeWidth={3} /> : null}
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
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.medium,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
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
