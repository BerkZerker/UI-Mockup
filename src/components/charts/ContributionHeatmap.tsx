import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme, SPACING, FONT_SIZE } from '../../theme';
import { CompletionStatus } from '../../types';

interface HeatmapDay {
  date: string;
  status: CompletionStatus | null;
}

interface ContributionHeatmapProps {
  data: HeatmapDay[];
  weeks?: number;
  color: string;
  colorFaint?: string;
  cellSize?: number;
  cellGap?: number;
}

const DAY_LABELS = ['M', '', 'W', '', 'F', '', ''];

/** GitHub-style contribution heatmap using SVG rects */
export function ContributionHeatmap({
  data,
  weeks = 13,
  color,
  colorFaint,
  cellSize = 12,
  cellGap = 2,
}: ContributionHeatmapProps) {
  const { theme } = useTheme();

  // Build a map for quick lookup
  const statusMap = new Map<string, CompletionStatus | null>();
  data.forEach(d => statusMap.set(d.date, d.status));

  // Build weeks x 7 grid going backward from today
  const today = new Date();
  const totalDays = weeks * 7;
  const grid: (CompletionStatus | null)[][] = [];

  // Find the start date (totalDays ago, aligned to Monday)
  const startDate = new Date(today);
  const todayDow = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0
  startDate.setDate(today.getDate() - totalDays + (6 - todayDow) + 1);

  for (let w = 0; w < weeks; w++) {
    const week: (CompletionStatus | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + d);
      if (cellDate > today) {
        week.push(null);
      } else {
        const dateStr = cellDate.toISOString().slice(0, 10);
        week.push(statusMap.get(dateStr) ?? null);
      }
    }
    grid.push(week);
  }

  // Get month labels
  const monthLabels: { label: string; x: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + w * 7);
    const month = d.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        x: w * (cellSize + cellGap),
      });
      lastMonth = month;
    }
  }

  const labelWidth = 16;
  const svgWidth = labelWidth + weeks * (cellSize + cellGap);
  const headerHeight = 16;
  const svgHeight = headerHeight + 7 * (cellSize + cellGap);

  const getCellColor = (status: CompletionStatus | null) => {
    if (status === 'completed') return color;
    if (status === 'skipped') return colorFaint || (color + '4D'); // ~30% opacity
    return theme.pillBg;
  };

  return (
    <View>
      <Svg width={svgWidth} height={svgHeight}>
        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <Rect key={`ml-${i}`} x={0} y={0} width={0} height={0} />
        ))}

        {/* Grid cells */}
        {grid.map((week, w) =>
          week.map((status, d) => (
            <Rect
              key={`${w}-${d}`}
              x={labelWidth + w * (cellSize + cellGap)}
              y={headerHeight + d * (cellSize + cellGap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getCellColor(status)}
            />
          ))
        )}
      </Svg>
      {/* Month labels as Text overlay (SVG text is finicky in RN) */}
      <View style={[styles.monthRow, { top: 0, left: labelWidth }]}>
        {monthLabels.map((m, i) => (
          <Text
            key={i}
            style={[
              styles.monthLabel,
              { color: theme.textTertiary, left: m.x },
            ]}
          >
            {m.label}
          </Text>
        ))}
      </View>
      {/* Day labels */}
      <View style={[styles.dayLabels, { top: headerHeight }]}>
        {DAY_LABELS.map((label, i) => (
          label ? (
            <Text
              key={i}
              style={[
                styles.dayLabel,
                { color: theme.textTertiary, top: i * (cellSize + cellGap) },
              ]}
            >
              {label}
            </Text>
          ) : null
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  monthLabel: {
    position: 'absolute',
    fontSize: FONT_SIZE.xs,
  },
  dayLabels: {
    position: 'absolute',
    left: 0,
  },
  dayLabel: {
    position: 'absolute',
    fontSize: FONT_SIZE.xs,
    lineHeight: 12,
  },
});
