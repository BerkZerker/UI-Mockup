import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, Flame, Check } from 'lucide-react-native';
import { useTheme } from '../theme';
import { Goal } from '../types';

interface GoalListItemProps {
  goal: Goal;
  onToggle: (id: number) => void;
  onPress?: (id: number) => void;
  showBorder?: boolean;
}

export function GoalListItem({ goal, onToggle, onPress, showBorder = true }: GoalListItemProps) {
  const { theme, accent } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(goal.id)}
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.borderSubtle,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Pressable
        onPress={() => onToggle(goal.id)}
        style={[
          styles.checkbox,
          {
            borderWidth: goal.done ? 0 : 2,
            borderColor: theme.textTertiary,
            backgroundColor: goal.done ? accent.primary : 'transparent',
          },
        ]}
      >
        {goal.done && <Check size={13} color="#fff" strokeWidth={3} />}
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: goal.done ? theme.textTertiary : theme.text,
              textDecorationLine: goal.done ? 'line-through' : 'none',
            },
          ]}
        >
          {goal.title}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.tag, { backgroundColor: theme.pillBg }]}>
            <Text style={[styles.tagText, { color: theme.textTertiary }]}>
              {goal.cat}
            </Text>
          </View>
          {goal.streak > 0 && (
            <View style={styles.streak}>
              <Flame size={10} color={theme.textTertiary} fill={theme.textTertiary} />
              <Text style={[styles.streakText, { color: theme.textTertiary }]}>
                {goal.streak}d
              </Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={14} color={theme.textTertiary} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    fontSize: 11,
  },
  chevron: {
    marginTop: 4,
  },
});
