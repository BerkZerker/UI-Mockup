import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { WKDAYS } from '../data';

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
              {WKDAYS[index]}
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
                    fontWeight: isToday ? '700' : '400',
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
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 6,
    width: 36,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
  },
});
