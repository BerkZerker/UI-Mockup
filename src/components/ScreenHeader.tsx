import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
    margin: 0,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.xxs,
  },
});
