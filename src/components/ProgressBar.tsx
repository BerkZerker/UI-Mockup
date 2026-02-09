import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '../theme';

interface ProgressBarProps {
  value: number;
  max: number;
  height?: number;
}

export function ProgressBar({ value, max, height = 5 }: ProgressBarProps) {
  const { theme, accent } = useTheme();
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.pillBg,
          borderRadius: height / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: accent.primary,
            borderRadius: height / 2,
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
