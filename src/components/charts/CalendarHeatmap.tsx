import { View, Text, StyleSheet } from "react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../../theme";
import { GlassCard } from "../GlassCard";
import { CalendarDay } from "../../data/mockStats";

interface Props {
  data: CalendarDay[];
  maxCount: number;
}

const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getCellColor(count: number, maxCount: number, accent: string, subtle: string): string {
  if (count === 0) return subtle;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return accent + "40"; // 25% opacity
  if (ratio <= 0.5) return accent + "73"; // 45% opacity
  if (ratio <= 0.75) return accent + "A6"; // 65% opacity
  return accent; // 100%
}

export function CalendarHeatmap({ data, maxCount }: Props) {
  const { theme } = useTheme();

  // Organize data into weeks (columns of 7 days)
  // Pad the beginning so the first day starts on correct day-of-week
  const firstDate = data.length > 0 ? new Date(data[0].date) : new Date();
  const startDay = (firstDate.getDay() + 6) % 7; // Monday = 0

  const padded: (CalendarDay | null)[] = [
    ...Array.from({ length: startDay }, () => null),
    ...data,
  ];

  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  // Pad last week to 7
  const last = weeks[weeks.length - 1];
  while (last && last.length < 7) last.push(null);

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
        Activity
      </Text>

      <View style={styles.gridContainer}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAY_LABELS.map((label, i) => (
            <View key={i} style={styles.dayLabelCell}>
              <Text style={[styles.dayLabelText, { color: theme.textMuted }]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Weeks */}
        <View style={styles.weeksRow}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekCol}>
              {week.map((day, di) => (
                <View
                  key={di}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: day
                        ? getCellColor(day.count, maxCount, theme.accent, theme.borderSubtle)
                        : "transparent",
                      borderRadius: RADIUS.xs,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.textMuted }]}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <View
            key={i}
            style={[
              styles.legendCell,
              {
                backgroundColor: getCellColor(
                  ratio * maxCount,
                  maxCount,
                  theme.accent,
                  theme.borderSubtle,
                ),
                borderRadius: RADIUS.xs,
              },
            ]}
          />
        ))}
        <Text style={[styles.legendText, { color: theme.textMuted }]}>More</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
  },
  dayLabels: {
    marginRight: CELL_GAP,
  },
  dayLabelCell: {
    width: 16,
    height: CELL_SIZE,
    marginBottom: CELL_GAP,
    justifyContent: "center",
  },
  dayLabelText: {
    fontSize: FONT_SIZE.xs,
  },
  weeksRow: {
    flexDirection: "row",
    gap: CELL_GAP,
  },
  weekCol: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: CELL_GAP,
    marginTop: SPACING.md,
    alignSelf: "flex-end",
  },
  legendCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  legendText: {
    fontSize: FONT_SIZE.xs,
  },
});
