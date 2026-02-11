import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../theme';
import { getHabitColor } from '../../theme/palette';
import { DayOfWeek, HabitColorId } from '../../types';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onToggle: (days: DayOfWeek[]) => void;
  colorId: HabitColorId;
}

/** 7-day toggle buttons with preset frequency options */
export function DaySelector({ selectedDays, onToggle, colorId }: DaySelectorProps) {
  const { theme } = useTheme();
  const habitColor = getHabitColor(colorId);

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onToggle(selectedDays.filter(d => d !== day));
    } else {
      onToggle([...selectedDays, day].sort());
    }
  };

  const presets = [
    { label: 'Daily', days: [] as DayOfWeek[] },
    { label: 'Weekdays', days: [0, 1, 2, 3, 4] as DayOfWeek[] },
    { label: '3x/week', days: [0, 2, 4] as DayOfWeek[] },
  ];

  const isPreset = (days: DayOfWeek[]) => {
    if (days.length === 0 && selectedDays.length === 0) return true;
    if (days.length !== selectedDays.length) return false;
    return days.every(d => selectedDays.includes(d));
  };

  return (
    <View>
      <View style={styles.presets}>
        {presets.map(p => (
          <Pressable
            key={p.label}
            onPress={() => onToggle(p.days)}
            style={({ pressed }) => [
              styles.preset,
              {
                backgroundColor: isPreset(p.days) ? habitColor.muted : theme.pillBg,
                opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
              },
            ]}
          >
            <Text style={[
              styles.presetText,
              { color: isPreset(p.days) ? habitColor.primary : theme.pillText },
            ]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.days}>
        {DAY_LABELS.map((label, idx) => {
          const day = idx as DayOfWeek;
          const isActive = selectedDays.length === 0 || selectedDays.includes(day);
          return (
            <Pressable
              key={idx}
              onPress={() => toggleDay(day)}
              style={({ pressed }) => [
                styles.dayButton,
                {
                  backgroundColor: isActive ? habitColor.primary : theme.pillBg,
                  opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
                },
              ]}
            >
              <Text style={[styles.dayText, { color: isActive ? '#fff' : theme.pillText }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  presets: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  preset: {
    paddingVertical: SPACING.sm - 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  presetText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  days: {
    flexDirection: 'row',
    gap: SPACING.sm - 2,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
