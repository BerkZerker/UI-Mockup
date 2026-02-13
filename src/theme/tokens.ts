export const SPACING = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const FONT_SIZE = {
  xs: 10, sm: 11, md: 12, base: 13, lg: 14, xl: 15,
  '2xl': 16, '3xl': 17, '4xl': 18, '5xl': 22, '6xl': 26,
} as const;

export const FONT_WEIGHT = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const RADIUS = {
  xs: 2, sm: 6, md: 9, lg: 10, xl: 14, full: 9999,
} as const;
