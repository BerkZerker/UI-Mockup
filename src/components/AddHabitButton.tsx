import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';

interface AddHabitButtonProps {
  onPress?: () => void;
}

export function AddHabitButton({ onPress }: AddHabitButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: pressed ? theme.accent : theme.borderSubtle,
        },
      ]}
    >
      {({ pressed }) => (
        <>
          <Text style={[styles.plus, { color: pressed ? theme.accent : theme.textMuted }]}>+</Text>
          <Text style={[styles.label, { color: pressed ? theme.accent : theme.textMuted }]}>
            Add habit
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: SPACING.md,
    padding: SPACING.lg - 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm - 2,
  },
  plus: { fontSize: FONT_SIZE['4xl'], fontWeight: FONT_WEIGHT.light, lineHeight: 20 },
  label: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.medium },
});
