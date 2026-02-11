import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line, Rect } from 'react-native-svg';
import { useTheme, SPACING, FONT_SIZE } from '../../theme';

interface StreakDataPoint {
  date: string;
  streak: number;
}

interface StreakLineChartProps {
  data: StreakDataPoint[];
  color: string;
  height?: number;
}

/** SVG line chart showing streak progression over time */
export function StreakLineChart({ data, color, height = 120 }: StreakLineChartProps) {
  const { theme } = useTheme();

  if (data.length < 2) return null;

  const padding = { top: 10, bottom: 24, left: 28, right: 8 };
  const chartWidth = 300;
  const chartHeight = height;
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const maxStreak = Math.max(...data.map(d => d.streak), 1);
  const yScale = (v: number) => padding.top + innerH - (v / maxStreak) * innerH;
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * innerW;

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.streak)}`).join(' ');

  // Area fill polygon
  const areaPoints = [
    `${xScale(0)},${yScale(0)}`,
    ...data.map((d, i) => `${xScale(i)},${yScale(d.streak)}`),
    `${xScale(data.length - 1)},${yScale(0)}`,
  ].join(' ');

  // Y-axis labels
  const yLabels = [...new Set([0, Math.round(maxStreak / 2), maxStreak])];

  // X-axis labels (every 7 days)
  const xLabels: { label: string; x: number }[] = [];
  for (let i = 0; i < data.length; i += 7) {
    const d = data[i];
    const date = new Date(d.date);
    xLabels.push({
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      x: xScale(i),
    });
  }

  return (
    <View>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {yLabels.map(v => (
          <Line
            key={v}
            x1={padding.left}
            y1={yScale(v)}
            x2={chartWidth - padding.right}
            y2={yScale(v)}
            stroke={theme.borderSubtle}
            strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        <Polyline
          points={areaPoints}
          fill={color + '1A'} // 10% opacity
          stroke="none"
        />

        {/* Line */}
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Dots */}
        {data.map((d, i) => (
          i % 7 === 0 || i === data.length - 1 ? (
            <Circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.streak)}
              r={3}
              fill={color}
            />
          ) : null
        ))}
      </Svg>

      {/* Y labels */}
      <View style={styles.yLabels}>
        {yLabels.map(v => (
          <Text
            key={v}
            style={[
              styles.axisLabel,
              { color: theme.textTertiary, position: 'absolute', top: yScale(v) - 6 },
            ]}
          >
            {v}
          </Text>
        ))}
      </View>

      {/* X labels */}
      <View style={[styles.xLabels, { top: chartHeight - 16 }]}>
        {xLabels.map((l, i) => (
          <Text
            key={i}
            style={[
              styles.axisLabel,
              { color: theme.textTertiary, position: 'absolute', left: l.x - 12 },
            ]}
          >
            {l.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  xLabels: {
    position: 'absolute',
    left: 0,
  },
  axisLabel: {
    fontSize: FONT_SIZE.xs,
  },
});
