import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme, SPACING, RADIUS, INTERACTIVE } from '../theme';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { accent } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add new item"
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: accent.primary,
          opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
        },
      ]}
    >
      <Plus size={24} color="#fff" strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 96,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
});
