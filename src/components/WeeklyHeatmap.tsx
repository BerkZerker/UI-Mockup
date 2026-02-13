import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme";

interface WeeklyHeatmapProps {
  data: number[];
  color: string;
}

export function WeeklyHeatmap({ data, color }: WeeklyHeatmapProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      {data.map((val, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: val > 0 ? color : theme.borderSubtle,
              opacity: val > 0 ? 0.4 + val * 0.6 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 3, marginLeft: "auto" },
  dot: { width: 8, height: 8, borderRadius: 2 },
});
