/**
 * NGX GENESIS HYBRID - Design System
 * Basado en: prototypes/mobile_genesis_hybrid_v2_flow.html
 *
 * Identidad: premium, directo, futurista, sobrio
 * Modo: dark-first con glassmorphism y acentos violet + mint
 */

export const colors = {
  // Primary - NGX Violet
  ngx: '#6D00FF',
  primary: '#6D00FF',

  // Secondary - Mint (coach, success)
  mint: '#00F5AA',
  coach: '#00F5AA',

  // Backgrounds
  void: '#050505',
  background: '#050505',
  surface: '#0A0A0C',
  surfaceElevated: '#12121A',
  surfaceHighlight: '#1A1A22',

  // Chrome neutrals
  chrome: '#C0C0C0',
  chromeDark: '#808080',
  chromeLight: '#E8E8E8',

  // Text
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.4)',

  // Semantic
  success: '#00F5AA',
  error: '#FF4757',
  warning: '#FFB347',

  // Glass effects
  glass: 'rgba(10, 10, 12, 0.7)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassHighlight: 'rgba(109, 0, 255, 0.5)',

  // Chip/Button borders
  chipBorder: 'rgba(192, 192, 192, 0.3)',
  chipHoverBorder: 'rgba(109, 0, 255, 0.5)',

  // Status pill
  statusPillBg: 'rgba(109, 0, 255, 0.18)',
  statusPillBorder: 'rgba(109, 0, 255, 0.5)',

  // Tab bar
  tabBarBg: 'rgba(0, 0, 0, 0.8)',
  tabBarBorder: 'rgba(255, 255, 255, 0.1)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20, // padding horizontal del prototype
  xl: 24,
  xxl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 28,
  '3xl': 38,
  '4xl': 44,
  full: 9999,
} as const;

export const typography = {
  // Font families
  fontFamily: {
    display: 'Syne',      // Titulos
    mono: 'JetBrains Mono', // Datos y microcopy
  },

  // Font sizes según style guide
  fontSize: {
    // Labels: 10px
    label: 10,
    xs: 11,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,  // H1 en style guide
    '4xl': 30,
    '5xl': 36,
  },

  // Letter spacing
  letterSpacing: {
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 3, // 0.12em para labels uppercase
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

export const shadows = {
  // Glass card hover glow
  glassGlow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  // Primary button glow
  primaryGlow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },

  // FAB shadow
  fabShadow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.6,
    shadowRadius: 36,
    elevation: 12,
  },

  // Chip hover
  chipGlow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 6,
  },

  // Metric highlight
  metricHighlight: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },

  // Tab active icon
  tabActiveGlow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Gradient arrays para LinearGradient
export const gradients = {
  // Fondo general: radial gradient (violet + void)
  background: ['#151226', '#050507', '#000000'] as const,

  // Progress bar
  progress: ['#6D00FF', '#B517FF', '#C0C0C0'] as const,

  // Glass card top highlight
  glassHighlight: ['transparent', 'rgba(109, 0, 255, 0.5)', 'transparent'] as const,

  // Header fade
  headerFade: ['#000000', 'rgba(0, 0, 0, 0.8)', 'transparent'] as const,
} as const;

// Animation durations
export const animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    drift: 12000, // ambient orb drift
    pulse: 1600,  // pulse dot
    ctaGlow: 2400, // CTA glow pulse
    fabPulse: 2000, // FAB pulse
  },
} as const;

// Layout constants
export const layout = {
  // Phone frame del prototype
  phoneWidth: 390,
  phoneHeight: 844,

  // Header height
  headerHeight: 80,

  // Tab bar
  tabBarHeight: 65,
  tabBarPadding: 16,

  // FAB
  fabSize: 54,
  fabBottom: 86,
  fabRight: 18,

  // Content padding
  contentPadding: 20,
  contentPaddingBottom: 100, // space for tab bar

  // Card gaps
  cardGap: 16,
  gridGap: 12,
} as const;

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  gradients,
  animation,
  layout,
} as const;

export type Theme = typeof theme;
