import { useState } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";
import Svg, {
  Path,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../../theme";
import { GlassCard } from "../GlassCard";

type TimeSpan = "week" | "month" | "year";

interface Props {
  data: number[];
  timeSpan: TimeSpan;
  onTimeSpanChange: (span: TimeSpan) => void;
}

const SPANS: { label: string; value: TimeSpan }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const CHART_HEIGHT = 180;
const CHART_WIDTH =
  Dimensions.get("window").width - SPACING.xl * 2 - 32;
const PADDING_LEFT = 30;
const PADDING_RIGHT = 8;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 20;

function sliceData(data: number[], span: TimeSpan): number[] {
  if (span === "week") return data.slice(-7);
  if (span === "month") return data.slice(-30);
  return data;
}

function getXLabels(span: TimeSpan): string[] {
  if (span === "week") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (span === "month") {
    return ["W1", "W2", "W3", "W4"];
  }
  return ["Jan", "Apr", "Jul", "Oct", "Dec"];
}

export function CompletionTrendChart({ data, timeSpan, onTimeSpanChange }: Props) {
  const { theme } = useTheme();
  const points = sliceData(data, timeSpan);
  const plotW = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  // Build line path
  const toX = (i: number) =>
    PADDING_LEFT + (i / Math.max(points.length - 1, 1)) * plotW;
  const toY = (v: number) => PADDING_TOP + (1 - v) * plotH;

  let linePath = "";
  points.forEach((v, i) => {
    const cmd = i === 0 ? "M" : "L";
    linePath += `${cmd}${toX(i).toFixed(1)},${toY(v).toFixed(1)} `;
  });

  // Area path (close to bottom)
  const areaPath =
    linePath +
    `L${toX(points.length - 1).toFixed(1)},${(PADDING_TOP + plotH).toFixed(1)} ` +
    `L${toX(0).toFixed(1)},${(PADDING_TOP + plotH).toFixed(1)} Z`;

  const xLabels = getXLabels(timeSpan);
  const yLabels = ["100%", "50%", "0%"];
  const yPositions = [PADDING_TOP, PADDING_TOP + plotH / 2, PADDING_TOP + plotH];

  return (
    <GlassCard style={{ padding: SPACING.xl }}>
      <Text
        style={{
          fontSize: FONT_SIZE.lg,
          fontWeight: FONT_WEIGHT.semibold,
          color: theme.textPrimary,
          marginBottom: SPACING.md,
        }}
      >
        Completion Trend
      </Text>

      {/* Time span selector */}
      <View style={styles.pillRow}>
        {SPANS.map((s) => (
          <Pressable
            key={s.value}
            onPress={() => onTimeSpanChange(s.value)}
            style={[
              styles.pill,
              {
                backgroundColor:
                  timeSpan === s.value ? theme.accentMuted : "transparent",
              },
            ]}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.sm,
                fontWeight: FONT_WEIGHT.medium,
                color: timeSpan === s.value ? theme.accent : theme.textMuted,
              }}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Chart */}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.accent} stopOpacity={0.3} />
            <Stop offset="1" stopColor={theme.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {yPositions.map((y, i) => (
          <Line
            key={i}
            x1={PADDING_LEFT}
            y1={y}
            x2={CHART_WIDTH - PADDING_RIGHT}
            y2={y}
            stroke={theme.borderSubtle}
            strokeDasharray="4,4"
          />
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <SvgText
            key={label}
            x={PADDING_LEFT - 4}
            y={yPositions[i] + 3}
            textAnchor="end"
            fill={theme.textMuted}
            fontSize={9}
          >
            {label}
          </SvgText>
        ))}

        {/* Area fill */}
        <Path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <Path d={linePath} stroke={theme.accent} strokeWidth={2} fill="none" />

        {/* X-axis labels */}
        {xLabels.map((label, i) => {
          const x =
            PADDING_LEFT +
            (i / Math.max(xLabels.length - 1, 1)) * plotW;
          return (
            <SvgText
              key={i}
              x={x}
              y={CHART_HEIGHT - 2}
              textAnchor="middle"
              fill={theme.textMuted}
              fontSize={9}
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  pill: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
});
