import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';
import { WEEKDAYS } from '../data';

interface WeekStripProps {
  days: string[];
  selectedDay?: string;
}

export function WeekStrip({ days, selectedDay = '7' }: WeekStripProps) {
  const { theme, accent } = useTheme();

  return (
    <View style={styles.container}>
      {days.map((day, index) => {
        const isToday = day === selectedDay;
        return (
          <View key={day} style={styles.dayContainer}>
            <Text style={[styles.dayLabel, { color: theme.textTertiary }]}>
              {WEEKDAYS[index]}
            </Text>
            <View
              style={[
                styles.dayCircle,
                {
                  backgroundColor: isToday ? accent.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: isToday ? '#fff' : theme.text,
                    fontWeight: isToday ? FONT_WEIGHT.bold : FONT_WEIGHT.regular,
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg - 2,
    paddingHorizontal: SPACING.sm,
  },
  dayContainer: {
    alignItems: 'center',
    gap: SPACING.sm - 2,
    width: 36,
  },
  dayLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  dayCircle: {
    width: SPACING.xxxl,
    height: SPACING.xxxl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: FONT_SIZE.lg,
  },
});
