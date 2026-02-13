import { ViewStyle } from "react-native";
import { ThemeColors } from "../types";
import { RADIUS } from "./tokens";

export const glassCard = (theme: ThemeColors): ViewStyle => ({
  backgroundColor: theme.glassBackground,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: RADIUS.xl,
});
