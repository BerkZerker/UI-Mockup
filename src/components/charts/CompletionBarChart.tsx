import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../theme';

interface BarData {
  label: string;
  completed: number;
  total: number;
}

interface CompletionBarChartProps {
  data: BarData[];
  color: string;
  height?: number;
}

/** SVG bar chart showing weekly completion rates */
export function CompletionBarChart({ data, color, height = 120 }: CompletionBarChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) return null;

  const padding = { top: 20, bottom: 24, left: 4, right: 4 };
  const chartWidth = 300;
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const barWidth = Math.min(28, (innerW / data.length) - 6);
  const gap = (innerW - barWidth * data.length) / (data.length + 1);

  return (
    <View>
      <Svg width={chartWidth} height={height}>
        {data.map((d, i) => {
          const pct = d.total > 0 ? d.completed / d.total : 0;
          const x = padding.left + gap + i * (barWidth + gap);
          const barH = pct * innerH;

          return (
            <View key={i}>
              {/* Background bar */}
              <Rect
                x={x}
                y={padding.top}
                width={barWidth}
                height={innerH}
                rx={4}
                fill={theme.pillBg}
              />
              {/* Foreground bar */}
              <Rect
                x={x}
                y={padding.top + innerH - barH}
                width={barWidth}
                height={Math.max(barH, 0)}
                rx={4}
                fill={color}
              />
            </View>
          );
        })}
      </Svg>

      {/* Percentage labels above bars */}
      <View style={[styles.labelRow, { top: 2 }]}>
        {data.map((d, i) => {
          const pct = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
          const x = padding.left + gap + i * (barWidth + gap) + barWidth / 2;
          return (
            <Text
              key={i}
              style={[
                styles.pctLabel,
                { color: theme.textTertiary, position: 'absolute', left: x - 12 },
              ]}
            >
              {pct}%
            </Text>
          );
        })}
      </View>

      {/* Week labels below bars */}
      <View style={[styles.labelRow, { top: height - 16 }]}>
        {data.map((d, i) => {
          const x = padding.left + gap + i * (barWidth + gap) + barWidth / 2;
          return (
            <Text
              key={i}
              style={[
                styles.weekLabel,
                { color: theme.textTertiary, position: 'absolute', left: x - 8 },
              ]}
            >
              {d.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pctLabel: {
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
  },
  weekLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: 'center',
  },
});
