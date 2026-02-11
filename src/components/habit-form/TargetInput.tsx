import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../theme';
import { TargetUnit } from '../../types';

const UNITS: { label: string; value: TargetUnit }[] = [
  { label: 'min', value: 'minutes' },
  { label: 'hr', value: 'hours' },
  { label: 'pages', value: 'pages' },
  { label: 'glasses', value: 'glasses' },
  { label: 'reps', value: 'reps' },
  { label: 'steps', value: 'steps' },
];

interface TargetInputProps {
  value: string;
  unit: TargetUnit | null;
  onChangeValue: (val: string) => void;
  onChangeUnit: (unit: TargetUnit) => void;
}

/** Numeric input + unit selector pills for habit targets */
export function TargetInput({ value, unit, onChangeValue, onChangeUnit }: TargetInputProps) {
  const { theme, accent } = useTheme();

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder="Target amount"
        placeholderTextColor={theme.textTertiary}
        keyboardType="numeric"
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.border,
            backgroundColor: theme.pillBg,
          },
        ]}
      />
      <View style={styles.units}>
        {UNITS.map(u => (
          <Pressable
            key={u.value}
            onPress={() => onChangeUnit(u.value)}
            style={({ pressed }) => [
              styles.unitPill,
              {
                backgroundColor: unit === u.value ? accent.primaryMuted : theme.pillBg,
                opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
              },
            ]}
          >
            <Text style={[
              styles.unitText,
              { color: unit === u.value ? accent.primary : theme.pillText },
            ]}>
              {u.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.medium,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  units: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  unitPill: {
    paddingVertical: SPACING.sm - 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  unitText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
});
