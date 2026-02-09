import { View, Text, Modal, Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Target, Hash, Plus, X } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../theme';

interface AddGoalMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function AddGoalMenu({ visible, onClose }: AddGoalMenuProps) {
  const { theme, accent } = useTheme();

  const menuItems = [
    {
      icon: Target,
      label: 'Add Daily Goal',
      description: 'A task to complete today',
      color: accent.primary,
    },
    {
      icon: Target,
      label: 'Add Long-term Goal',
      description: 'An ongoing objective',
      color: accent.primaryHover,
    },
    {
      icon: Hash,
      label: 'Add Habit',
      description: 'Track a recurring activity',
      color: accent.primary,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <View style={[styles.menu, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.headerIcon, { backgroundColor: accent.primary }]}>
                      <Plus size={18} color="#fff" strokeWidth={2.5} />
                    </View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                      Add New
                    </Text>
                  </View>
                  <Pressable
                    onPress={onClose}
                    accessibilityLabel="Close menu"
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.closeButton,
                      { opacity: pressed ? INTERACTIVE.pressedOpacityHeavy : 1 },
                    ]}
                  >
                    <X size={20} color={theme.textSecondary} />
                  </Pressable>
                </View>

                {/* Menu Items */}
                <View style={styles.items}>
                  {menuItems.map((item, index) => (
                    <Pressable
                      key={index}
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.menuItem,
                        {
                          opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
                          borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                          borderBottomColor: theme.borderSubtle,
                        },
                      ]}
                      onPress={onClose}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                        <item.icon size={20} color={item.color} strokeWidth={2} />
                      </View>
                      <View style={styles.itemText}>
                        <Text style={[styles.itemLabel, { color: theme.text }]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.itemDescription, { color: theme.textTertiary }]}>
                          {item.description}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
  },
  menu: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: SPACING.xl,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  items: {
    paddingTop: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.lg - 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xxs,
  },
  itemDescription: {
    fontSize: FONT_SIZE.base,
  },
});
