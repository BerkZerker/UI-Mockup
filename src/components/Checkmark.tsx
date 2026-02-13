import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CheckmarkProps {
  checked: boolean;
  color: string;
  size?: number;
}

export function Checkmark({ checked, color, size = 20 }: CheckmarkProps) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0,
      tension: 200,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  return (
    <Animated.View style={{ transform: [{ scale: scale.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }}>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Rect
          x={1} y={1} width={18} height={18} rx={6}
          stroke={checked ? color : '#9a9a9a'}
          strokeWidth={1.5}
          fill={checked ? color : 'none'}
          opacity={checked ? 1 : 0.3}
        />
        {checked && (
          <Path
            d="M6 10.5L8.5 13L14 7.5"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </Animated.View>
  );
}
