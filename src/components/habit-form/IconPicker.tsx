import { View, Pressable, StyleSheet } from 'react-native';
import {
  Heart, Book, Dumbbell, Brain, Music, Pencil, Droplets, Sun,
  Moon, Star, Coffee, Leaf, Apple, Bike, Bed, Pill,
} from 'lucide-react-native';
import { useTheme, SPACING, RADIUS, INTERACTIVE } from '../../theme';
import { getHabitColor } from '../../theme/palette';
import { HabitColorId } from '../../types';

const ICONS = [
  { name: 'Heart', Icon: Heart },
  { name: 'Book', Icon: Book },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'Brain', Icon: Brain },
  { name: 'Music', Icon: Music },
  { name: 'Pencil', Icon: Pencil },
  { name: 'Droplets', Icon: Droplets },
  { name: 'Sun', Icon: Sun },
  { name: 'Moon', Icon: Moon },
  { name: 'Star', Icon: Star },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Leaf', Icon: Leaf },
  { name: 'Apple', Icon: Apple },
  { name: 'Bike', Icon: Bike },
  { name: 'Bed', Icon: Bed },
  { name: 'Pill', Icon: Pill },
];

interface IconPickerProps {
  selected: string;
  onSelect: (name: string) => void;
  colorId: HabitColorId;
}

/** 4-column grid of curated lucide icons */
export function IconPicker({ selected, onSelect, colorId }: IconPickerProps) {
  const { theme } = useTheme();
  const habitColor = getHabitColor(colorId);

  return (
    <View style={styles.grid}>
      {ICONS.map(({ name, Icon }) => {
        const isSelected = selected === name;
        return (
          <Pressable
            key={name}
            onPress={() => onSelect(isSelected ? '' : name)}
            accessibilityLabel={`${name} icon`}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.cell,
              {
                backgroundColor: isSelected ? habitColor.muted : theme.pillBg,
                opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
              },
            ]}
          >
            <Icon
              size={22}
              color={isSelected ? habitColor.primary : theme.textTertiary}
              strokeWidth={1.8}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cell: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
