import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { useTheme } from "../theme";

const { width: W, height: H } = Dimensions.get("window");

export function GradientWash() {
  const { theme } = useTheme();

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="wash" cx="65%" cy="15%" rx="45%" ry="35%">
            <Stop offset="0" stopColor={theme.accent} stopOpacity="0.12" />
            <Stop offset="1" stopColor={theme.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse
          cx={W * 0.65}
          cy={H * 0.15}
          rx={W * 0.45}
          ry={H * 0.35}
          fill="url(#wash)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});
