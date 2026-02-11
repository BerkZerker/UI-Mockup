import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../theme';

interface MilestoneCelebrationProps {
  message: string;
  color: string;
  visible: boolean;
  onDone: () => void;
}

/** Subtle milestone celebration overlay with glow animation */
export function MilestoneCelebration({ message, color, visible, onDone }: MilestoneCelebrationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold for a moment, then fade out
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            scale.setValue(0.8);
            onDone();
          });
        }, 1800);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.badge,
          {
            backgroundColor: color,
            opacity,
            transform: [{ scale }],
            shadowColor: color,
          },
        ]}
      >
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: {
    fontSize: FONT_SIZE['2xl'],
  },
  message: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#fff',
  },
});
