import { View, Text, StyleSheet } from "react-native";
import { useTheme, SPACING, FONT_SIZE, RADIUS } from "../theme";

interface AggregateWeeklyHeatmapProps {
  data: number[]; // 7 values, each 0.0-1.0 representing fraction of habits completed
}

const SQUARE_SIZE = 32;

export function AggregateWeeklyHeatmap({ data }: AggregateWeeklyHeatmapProps) {
  const { theme } = useTheme();

  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "narrow" });
  });

  return (
    <View style={styles.row}>
      {data.map((value, i) => {
        const isToday = i === 6;
        const bgColor =
          value === 0
            ? theme.borderSubtle
            : theme.accent;
        const opacity = value === 0 ? 1 : 0.2 + value * 0.8;

        return (
          <View key={i} style={styles.item}>
            <View
              style={[
                styles.square,
                {
                  backgroundColor: bgColor,
                  opacity,
                },
                isToday && {
                  borderWidth: 1,
                  borderColor: theme.accent,
                },
              ]}
            />
            <Text style={[styles.dayLabel, { color: theme.textMuted }]}>
              {dayLabels[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: RADIUS.sm,
  },
  dayLabel: {
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
    marginTop: SPACING.xxs,
  },
});
