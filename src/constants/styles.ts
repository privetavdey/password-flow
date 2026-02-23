export const DARK_COLORS = {
  BACKGROUND: '#090707',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.5)',
  TEXT_TERTIARY: 'rgba(255, 255, 255, 0.32)',
  TEXT_QUATERNARY: 'rgba(255, 255, 255, 0.48)',
  TEXT_QUINARY: 'rgba(255, 255, 255, 0.88)',
  ACCENT_GREEN: '#13bc80',
  BORDER: 'rgba(255, 255, 255, 0.1)',
  BORDER_SUBTLE: 'rgba(255, 255, 255, 0.04)',
  BG_SUBTLE: 'rgba(255, 255, 255, 0.08)',
  SHEET_BG: '#131111',
  NAV_BG: 'rgba(9, 7, 7, 0.64)',
  SHIMMER_BASE: 'rgba(255, 255, 255, 0.48)',
  SHIMMER_HIGHLIGHT: 'rgba(255, 255, 255, 0.88)',
  BACKDROP: 'rgba(11, 6, 5, 0.5)',
  HANDLE: 'rgba(255, 255, 255, 0.2)',
  BG_SUBTLE_TRANSPARENT: 'rgba(255, 255, 255, 0)',
  INNER_GLOW: 'rgba(255, 255, 255, 0.08)',
};

export const LIGHT_COLORS: typeof DARK_COLORS = {
  BACKGROUND: '#ffffff',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: 'rgba(0, 0, 0, 0.5)',
  TEXT_TERTIARY: 'rgba(0, 0, 0, 0.32)',
  TEXT_QUATERNARY: 'rgba(0, 0, 0, 0.48)',
  TEXT_QUINARY: 'rgba(0, 0, 0, 0.88)',
  ACCENT_GREEN: '#13bc80',
  BORDER: 'rgba(0, 0, 0, 0.1)',
  BORDER_SUBTLE: 'rgba(0, 0, 0, 0.04)',
  BG_SUBTLE: 'rgba(0, 0, 0, 0.06)',
  SHEET_BG: '#ffffff',
  NAV_BG: 'rgba(255, 255, 255, 0.72)',
  SHIMMER_BASE: 'rgba(0, 0, 0, 0.48)',
  SHIMMER_HIGHLIGHT: 'rgba(0, 0, 0, 0.88)',
  BACKDROP: 'rgba(0, 0, 0, 0.25)',
  HANDLE: 'rgba(0, 0, 0, 0.2)',
  BG_SUBTLE_TRANSPARENT: 'rgba(0, 0, 0, 0)',
  INNER_GLOW: 'rgba(0, 0, 0, 0.06)',
};

export type ColorTheme = typeof DARK_COLORS;

export const COLORS = DARK_COLORS;

export const OPACITY = {
  FULL: 1,
  HIGH: 0.88,
  MEDIUM: 0.5,
  LOW: 0.32,
  LOWER: 0.1,
  LOWEST: 0.08,
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '48px',
};

export const BORDER_RADIUS = {
  sm: '16px',
  md: '24px',
  lg: '32px',
  full: '999px',
};
