import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";
import { useTheme } from "../theme";

const { width: W, height: H } = Dimensions.get("window");
const TILE = 80;
const STEP = 6;

function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263 + 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

const dots: {
  cx: number;
  cy: number;
  r: number;
  opDark: number;
  opLight: number;
}[] = [];
for (let y = 0; y < TILE; y += STEP) {
  for (let x = 0; x < TILE; x += STEP) {
    const rand = hash(x, y);
    dots.push({
      cx: x + 1,
      cy: y + 1,
      r: 0.3 + rand * 0.4,
      opDark: 0.01 + rand * 0.06,
      opLight: 0.01 + rand * 0.05,
    });
  }
}

export function NoiseBackground() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const base = isDark ? "255,255,255" : "0,0,0";

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={W} height={H} style={styles.svg}>
        <Defs>
          <Pattern
            id="noise"
            x="0"
            y="0"
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
          >
            {dots.map((d, i) => (
              <Circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r={d.r}
                fill={`rgba(${base},${(isDark ? d.opDark : d.opLight).toFixed(3)})`}
              />
            ))}
          </Pattern>
        </Defs>
        <Rect width={W} height={H} fill="url(#noise)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  svg: { position: "absolute" },
});
