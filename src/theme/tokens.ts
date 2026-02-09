export const SPACING = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const FONT_SIZE = {
  xs: 10, sm: 11, md: 12, base: 13, lg: 14, xl: 15,
  '2xl': 16, '3xl': 17, '4xl': 18, '5xl': 22, '6xl': 28, '7xl': 32, '8xl': 64,
} as const;

export const FONT_WEIGHT = {
  regular: '400' as const, medium: '500' as const,
  semibold: '600' as const, bold: '700' as const,
};

export const RADIUS = {
  xs: 3, sm: 6, md: 10, lg: 12, xl: 14, '2xl': 16, '3xl': 20, full: 9999,
} as const;

export const INTERACTIVE = {
  pressedOpacity: 0.7, pressedOpacityLight: 0.8, pressedOpacityHeavy: 0.6,
} as const;
