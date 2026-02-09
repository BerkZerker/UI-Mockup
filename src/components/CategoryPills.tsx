import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../theme';
import { CategoryFilter } from '../types';

interface CategoryPillsProps {
  categories: CategoryFilter[];
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  const { theme, accent } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((cat) => {
        const isSelected = cat === selected;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isSelected ? accent.primary : theme.pillBg,
                opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: isSelected ? '#fff' : theme.pillText,
                  fontWeight: isSelected ? FONT_WEIGHT.semibold : FONT_WEIGHT.regular,
                },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  content: {
    gap: 7,
    paddingBottom: SPACING.xxs,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: RADIUS.xl,
  },
  pillText: {
    fontSize: FONT_SIZE.base,
  },
});
