import { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../theme";
import { getHabitColor } from "../theme/palette";
import { Habit } from "../types";
import { Checkmark } from "./Checkmark";

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

  const [isAnimating, setIsAnimating] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const shimmerScale = useRef(new Animated.Value(1)).current;

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
    Animated.spring(pressAnim, {
      toValue: 0.98,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleToggle = () => {
    if (!habit.completed) {
      setIsAnimating(true);
      shimmerAnim.setValue(0);
      shimmerScale.setValue(1);
      Animated.parallel([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shimmerScale, {
            toValue: 1.01,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => setIsAnimating(false));
    }
    onToggle(habit.id);
  };

  const combinedScale = Animated.multiply(pressAnim, shimmerScale);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [
          { scale: combinedScale },
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <Pressable
        onPress={handleToggle}
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
          <Text
            style={[
              styles.name,
              { color: habit.completed ? theme.textMuted : theme.textPrimary },
              habit.completed && styles.nameCompleted,
            ]}
          >
            {habit.name}
          </Text>
        </View>

        {isAnimating && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: `${hColor}20`,
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.25, 0.5, 1],
                  outputRange: [0, 0.8, 0.6, 0],
                }),
              },
            ]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: SPACING.sm - 2,
    overflow: "hidden",
  },
  checkbox: { flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: FONT_SIZE["2xl"], fontWeight: FONT_WEIGHT.medium },
  nameCompleted: { textDecorationLine: "line-through" },
  time: { fontSize: FONT_SIZE.base, marginTop: 3 },
});
