import { View, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { HABIT_COLORS } from '../../theme/palette';
import { HabitColorId } from '../../types';
import { SPACING } from '../../theme';

interface ColorPickerProps {
  selected: HabitColorId;
  onSelect: (id: HabitColorId) => void;
}

/** 8 colored circles for picking a habit color */
export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {HABIT_COLORS.map(color => {
        const isSelected = color.id === selected;
        return (
          <Pressable
            key={color.id}
            onPress={() => onSelect(color.id)}
            accessibilityLabel={`${color.label} color`}
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.circle,
              {
                backgroundColor: color.primary,
                borderWidth: isSelected ? 2.5 : 0,
                borderColor: '#fff',
              },
            ]}
          >
            {isSelected && <Check size={16} color="#fff" strokeWidth={3} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
