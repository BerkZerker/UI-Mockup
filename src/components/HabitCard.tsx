import { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import { Check, X } from "lucide-react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../theme";
import { getHabitColor } from "../theme/palette";
import { Habit } from "../types";
import { Checkmark } from "./Checkmark";

const SWIPE_THRESHOLD = 80;

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
  const translateX = useRef(new Animated.Value(0)).current;

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

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const { translationX: tx } = e.nativeEvent;

      // Swipe left past threshold & not completed → mark done
      if (tx < -SWIPE_THRESHOLD && !habit.completed) {
        onToggle(habit.id);
      }
      // Swipe right past threshold & completed → mark undone
      else if (tx > SWIPE_THRESHOLD && habit.completed) {
        onToggle(habit.id);
      }

      // Spring back to center
      Animated.spring(translateX, {
        toValue: 0,
        tension: 200,
        friction: 20,
        useNativeDriver: true,
      }).start();
    }
  };

  const combinedScale = Animated.multiply(pressAnim, shimmerScale);

  // Tint opacity: base 0.04 → intensifies to 0.25 as card passes threshold
  const tintOpacity = translateX.interpolate({
    inputRange: [
      -SWIPE_THRESHOLD * 1.5,
      -SWIPE_THRESHOLD,
      0,
      SWIPE_THRESHOLD,
      SWIPE_THRESHOLD * 1.5,
    ],
    outputRange: [0.35, 0.2, 0.05, 0.2, 0.35],
    extrapolate: "clamp",
  });

  // Behind-card indicator opacities
  const checkIndicatorOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.3, 0],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const undoIndicatorOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.3, SWIPE_THRESHOLD],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

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
      {/* Behind-card swipe indicators */}
      <View style={styles.indicatorContainer}>
        {/* Left side: X revealed on swipe right (undo) */}
        <Animated.View
          style={[styles.indicator, { opacity: undoIndicatorOpacity }]}
        >
          <X size={24} color={theme.textMuted} strokeWidth={3} />
        </Animated.View>

        {/* Right side: checkmark revealed on swipe left (mark done) */}
        <Animated.View
          style={[styles.indicator, { opacity: checkIndicatorOpacity }]}
        >
          <Check size={24} color={hColor} strokeWidth={3} />
        </Animated.View>
      </View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-15, 15]}
        failOffsetY={[-10, 10]}
      >
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Pressable
            onPress={handleToggle}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.card,
              {
                backgroundColor: theme.glassBackground,
                borderColor: `${hColor}80`,
              },
            ]}
          >
            {/* Color tint overlay */}
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: hColor,
                  opacity: tintOpacity,
                },
              ]}
            />

            <View style={styles.checkbox}>
              <Checkmark checked={habit.completed} color={hColor} />
            </View>

            <View style={styles.info}>
              <Text
                style={[
                  styles.name,
                  {
                    color: habit.completed
                      ? theme.textMuted
                      : theme.textPrimary,
                  },
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
      </PanGestureHandler>
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
  indicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
