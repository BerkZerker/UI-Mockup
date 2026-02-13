import { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Mic, Flame } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../theme';
import { getHabitColor } from '../theme/palette';
import { Habit } from '../types';
import { Checkmark } from './Checkmark';
import { WeeklyHeatmap } from './WeeklyHeatmap';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  index?: number;
}

export function HabitCard({ habit, onToggle, index = 0 }: HabitCardProps) {
  const { theme } = useTheme();
  const hColor = getHabitColor(habit.colorId).primary;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.98, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [
          { scale: pressAnim },
          { translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
        ],
      }}
    >
      <Pressable
        onPress={() => onToggle(habit.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: theme.glassBackground,
            borderColor: habit.completed ? `${hColor}22` : theme.glassBorder,
          },
        ]}
      >
        <View style={styles.checkbox}>
          <Checkmark checked={habit.completed} color={hColor} />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                { color: habit.completed ? theme.textMuted : theme.textPrimary },
                habit.completed && styles.nameCompleted,
              ]}
            >
              {habit.name}
            </Text>
            {habit.streak > 0 && (
              <View style={styles.streakBadge}>
                <Flame
                  size={10}
                  color={habit.streak >= 20 ? theme.accent : theme.textMuted}
                  fill={habit.streak >= 20 ? theme.accent : theme.textMuted}
                />
                <Text
                  style={[
                    styles.streakText,
                    {
                      color: habit.streak >= 20 ? theme.accent : theme.textMuted,
                      opacity: habit.streak >= 20 ? 1 : 0.7,
                    },
                  ]}
                >
                  {habit.streak}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.time, { color: theme.textMuted }]}>{habit.time}</Text>
            {habit.hasVoiceNote && (
              <View style={styles.voiceNote}>
                <Mic size={10} color={theme.textMuted} />
                <Text style={[styles.voiceText, { color: theme.textMuted }]}>Note</Text>
              </View>
            )}
          </View>
        </View>

        <WeeklyHeatmap data={habit.weekly} color={hColor} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: SPACING.sm - 2,
  },
  checkbox: { flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.medium },
  nameCompleted: { textDecorationLine: 'line-through' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  streakText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 3 },
  time: { fontSize: FONT_SIZE.sm },
  voiceNote: { flexDirection: 'row', alignItems: 'center', gap: 3, opacity: 0.6 },
  voiceText: { fontSize: FONT_SIZE.xs },
});
