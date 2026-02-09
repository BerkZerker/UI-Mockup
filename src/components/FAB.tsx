import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../theme';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { accent } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: accent.primary,
          opacity: pressed ? 0.8 : 1,
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
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
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
