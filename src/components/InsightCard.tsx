import { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { Sparkles } from "lucide-react-native";
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../theme";

const { width: SCREEN_W } = Dimensions.get("window");

interface InsightCardProps {
  title: string;
  description: string;
}

export function InsightCard({ title, description }: InsightCardProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassBackground,
          borderColor: theme.glassBorder,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: theme.accentFaint }]}>
        <Sparkles size={16} color={theme.accent} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.desc, { color: theme.textMuted }]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: { flex: 1 },
  title: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: 3,
  },
  desc: { fontSize: FONT_SIZE.md, lineHeight: 17 },
});
