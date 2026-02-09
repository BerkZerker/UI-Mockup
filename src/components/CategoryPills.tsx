import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
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
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isSelected ? accent.primary : theme.pillBg,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: isSelected ? '#fff' : theme.pillText,
                  fontWeight: isSelected ? '600' : '400',
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
    marginTop: 16,
    paddingHorizontal: 20,
  },
  content: {
    gap: 7,
    paddingBottom: 2,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 13,
  },
});
