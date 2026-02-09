import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { useTheme } from '../theme';

export function DotPattern() {
  const { mode } = useTheme();
  const { width, height } = Dimensions.get('window');

  const patternSize = 120;
  const spacing = 12;
  const isDark = mode === 'dark';
  const baseColor = isDark ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
  const maxOpacity = isDark ? 0.06 : 0.05;
  const minOpacity = isDark ? 0.01 : 0.01;

  // Simple deterministic hash for pseudo-random per-dot variation
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263 + 1274126177) | 0;
    h = Math.imul(h ^ (h >>> 13), 1103515245);
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967295;
  };

  const circles = [];
  let key = 0;
  for (let y = 0; y < patternSize; y += spacing) {
    for (let x = 0; x < patternSize; x += spacing) {
      const rand = hash(x, y);
      const opacity = minOpacity + rand * (maxOpacity - minOpacity);
      const radius = 0.5 + rand * 0.4;
      circles.push(
        <Circle
          key={key++}
          cx={x + 1}
          cy={y + 1}
          r={radius}
          fill={`${baseColor}${opacity.toFixed(3)})`}
        />
      );
    }
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <Pattern
            id="dotPattern"
            x="0"
            y="0"
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            {circles}
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#dotPattern)" />
      </Svg>
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
  },
  svg: {
    position: 'absolute',
  },
});
