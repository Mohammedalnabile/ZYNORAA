// Zynora Design System - Elegant Multi-Tone Theme Configuration
// Premium marketplace color palette with excellent accessibility

// ============================================
// 🎨 ELEGANT COLOR PALETTE
// ============================================
export const elegantPalette = {
  // Core Colors from palette
  noir: '#0A0A0A',              // Deep black - primary dark
  terracotta: '#B85C5C',        // Coral/terracotta - warm accent
  emerald: '#2ECC9B',           // Emerald teal - success/fresh
  burgundy: '#5C2A2A',          // Dark wine - depth/luxury

  // Extended Variants
  noirLight: '#1A1A1A',         // Lighter black for surfaces
  noirSoft: '#2D2D2D',          // Soft black for cards
  
  terracottaLight: '#D47A7A',   // Lighter coral
  terracottaDark: '#943E3E',    // Deeper terracotta
  terracottaMuted: '#C96B6B',   // Muted variant
  
  emeraldLight: '#5EDDB5',      // Lighter emerald
  emeraldDark: '#1FA676',       // Deeper emerald
  emeraldMuted: '#3DBEA3',      // Muted teal
  
  burgundyLight: '#7D3D3D',     // Lighter burgundy
  burgundyDark: '#3D1A1A',      // Deeper wine
  burgundyMuted: '#6B3333',     // Muted burgundy
};

// Legacy gold palette for backward compatibility
export const goldPalette = {
  // Map to new elegant colors
  antiqueGold: elegantPalette.terracotta,
  mutedGold: elegantPalette.terracottaMuted,
  champagneGold: elegantPalette.terracottaLight,
  bronze: elegantPalette.burgundy,

  // Extended variants
  antiqueGoldHover: elegantPalette.terracottaDark,
  antiqueGoldLight: elegantPalette.terracottaLight,
  mutedGoldHover: elegantPalette.burgundyLight,
  champagneGoldLight: '#E8A8A8',
  bronzeLight: elegantPalette.burgundyLight,
  bronzeDark: elegantPalette.burgundyDark,
  
  // New elegant colors
  primary: elegantPalette.emerald,
  primaryHover: elegantPalette.emeraldDark,
  primaryLight: elegantPalette.emeraldLight,
};

// ============================================
// COLOR SYSTEM
// ============================================
export const colors = {
  // Primary Colors (Emerald-based for fresh, trustworthy feel)
  primary: {
    main: elegantPalette.emerald,
    hover: elegantPalette.emeraldDark,
    light: elegantPalette.emeraldLight,
    dark: elegantPalette.emeraldDark,
    // Legacy aliases for compatibility
    darkGreen: elegantPalette.emerald,
    darkGreenHover: elegantPalette.emeraldDark,
    darkGreenLight: elegantPalette.emeraldLight,
  },

  // Secondary Colors (Terracotta for warmth)
  secondary: {
    main: elegantPalette.terracotta,
    hover: elegantPalette.terracottaDark,
    light: elegantPalette.terracottaLight,
    dark: elegantPalette.burgundy,
    // Legacy aliases
    gold: elegantPalette.terracotta,
    goldLight: elegantPalette.terracottaLight,
    goldDark: elegantPalette.burgundy,
    mint: elegantPalette.emeraldLight,
    mintLight: '#7DE8C7',
    mintDark: elegantPalette.emeraldDark,
  },

  // Neutral Colors
  neutral: {
    charcoal: elegantPalette.noir,
    charcoalLight: elegantPalette.noirLight,
    gray: '#6B7280',
    grayLight: '#9CA3AF',
    grayLighter: '#E5E7EB',
    offWhite: '#F8F7F6',
    cream: '#FDFCFB',
  },

  // Accent / Interaction Colors
  accent: {
    alertRed: elegantPalette.terracotta,
    alertRedLight: elegantPalette.terracottaLight,
    alertRedDark: elegantPalette.burgundy,
    infoBlue: '#5B8AC9',
    infoBlueLight: '#7AA3D9',
    infoBlueDark: '#4A739F',
    success: elegantPalette.emerald,
    successLight: elegantPalette.emeraldLight,
    successDark: elegantPalette.emeraldDark,
  },

  // Background Colors
  background: {
    // Light mode
    light: '#FDFCFB',
    lightSecondary: '#FFFFFF',
    lightTertiary: '#F8F7F6',
    lightAccent: elegantPalette.emerald + '10',
    // Dark mode
    dark: elegantPalette.noir,
    darkSecondary: elegantPalette.noirLight,
    darkTertiary: elegantPalette.noirSoft,
    darkAccent: elegantPalette.emerald + '15',
  },

  // Text Colors
  text: {
    light: {
      primary: elegantPalette.noir,
      secondary: '#4A4A4A',
      tertiary: '#6B7280',
      inverse: '#FFFFFF',
      gold: elegantPalette.burgundy,
    },
    dark: {
      primary: '#FDFCFB',
      secondary: '#D1D1D1',
      tertiary: '#9A9A9A',
      inverse: elegantPalette.noir,
      gold: elegantPalette.terracottaLight,
    },
  },

  // Trust Score Colors (Elegant hierarchy)
  trust: {
    high: elegantPalette.emerald,
    medium: elegantPalette.terracotta,
    low: elegantPalette.burgundy,
    new: '#9CA3AF',
  },

  // Status Colors (Refined palette)
  status: {
    success: elegantPalette.emerald,
    warning: elegantPalette.terracotta,
    error: elegantPalette.burgundy,
    info: '#5B8AC9',
    pending: elegantPalette.terracottaLight,
  },

  // Gold Palette Export (for backward compatibility)
  gold: goldPalette,
  
  // New Elegant Palette Export
  elegant: elegantPalette,
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  fontFamily: {
    latin: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    arabic: "'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "'Playfair Display', Georgia, serif", // Luxury display font
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    luxury: '0.1em', // For luxury headlines
  },
};

// ============================================
// SPACING
// ============================================
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
};

// ============================================
// SHADOWS (Elegant tinted for premium feel)
// ============================================
export const shadows = {
  // Standard shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Elegant colored shadows
  glow: `0 0 20px ${elegantPalette.emerald}40`,
  goldGlow: `0 0 30px ${elegantPalette.terracotta}40`,
  goldSubtle: `0 4px 20px ${elegantPalette.terracotta}20`,
  bronzeDepth: `0 8px 32px ${elegantPalette.burgundy}30`,
  emeraldGlow: `0 0 25px ${elegantPalette.emerald}35`,
  terracottaWarm: `0 4px 15px ${elegantPalette.terracotta}25`,
  
  // Dark mode shadows
  darkGlow: `0 0 20px ${elegantPalette.emerald}20`,
  darkElevation: '0 8px 32px rgba(0, 0, 0, 0.5)',
};

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  luxury: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth luxury transition
};

// ============================================
// Z-INDEX
// ============================================
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
};

// ============================================
// LIGHT THEME
// ============================================
export const lightTheme = {
  colors: {
    ...colors,
    bg: {
      primary: colors.background.light,
      secondary: colors.background.lightSecondary,
      tertiary: colors.background.lightTertiary,
      accent: colors.background.lightAccent,
    },
    text: colors.text.light,
    // Button states
    button: {
      primary: {
        bg: elegantPalette.emerald,
        hover: elegantPalette.emeraldDark,
        active: elegantPalette.emeraldDark,
        text: '#FFFFFF',
        disabled: '#D1D5DB',
        disabledText: '#9CA3AF',
      },
      secondary: {
        bg: 'transparent',
        hover: elegantPalette.emerald + '15',
        active: elegantPalette.emerald + '25',
        text: elegantPalette.emerald,
        border: elegantPalette.emerald,
        disabled: 'transparent',
        disabledText: '#9CA3AF',
        disabledBorder: '#D1D5DB',
      },
      outline: {
        bg: 'transparent',
        hover: elegantPalette.terracotta + '12',
        active: elegantPalette.terracotta + '20',
        text: elegantPalette.burgundy,
        border: elegantPalette.terracotta,
      },
      danger: {
        bg: elegantPalette.terracotta,
        hover: elegantPalette.terracottaDark,
        active: elegantPalette.burgundy,
        text: '#FFFFFF',
      },
    },
    // Card styles
    card: {
      bg: colors.background.lightSecondary,
      border: elegantPalette.emerald + '20',
      shadow: shadows.base,
    },
    // Input styles
    input: {
      bg: colors.background.lightSecondary,
      border: colors.neutral.grayLighter,
      borderFocus: elegantPalette.emerald,
      placeholder: colors.neutral.grayLight,
    },
    // Navigation
    nav: {
      bg: colors.background.lightSecondary,
      border: elegantPalette.emerald + '15',
      active: elegantPalette.emerald,
      hover: elegantPalette.emerald + '12',
    },
    // Badges
    badge: {
      gold: {
        bg: elegantPalette.terracotta + '20',
        text: elegantPalette.burgundy,
      },
      success: {
        bg: elegantPalette.emerald + '18',
        text: elegantPalette.emeraldDark,
      },
      warning: {
        bg: elegantPalette.terracotta + '20',
        text: elegantPalette.terracottaDark,
      },
      error: {
        bg: elegantPalette.burgundy + '20',
        text: elegantPalette.burgundy,
      },
      info: {
        bg: colors.accent.infoBlue + '20',
        text: colors.accent.infoBlue,
      },
    },
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  mode: 'light' as const,
};

// ============================================
// DARK THEME (Premium Dark Mode)
// ============================================
export const darkTheme = {
  colors: {
    ...colors,
    bg: {
      primary: colors.background.dark,
      secondary: colors.background.darkSecondary,
      tertiary: colors.background.darkTertiary,
      accent: colors.background.darkAccent,
    },
    text: colors.text.dark,
    // Button states (refined for dark mode)
    button: {
      primary: {
        bg: elegantPalette.emerald,
        hover: elegantPalette.emeraldLight,
        active: elegantPalette.emeraldDark,
        text: elegantPalette.noir,
        disabled: '#3D3D3D',
        disabledText: '#6B6B6B',
      },
      secondary: {
        bg: 'transparent',
        hover: elegantPalette.emerald + '20',
        active: elegantPalette.emerald + '30',
        text: elegantPalette.emeraldLight,
        border: elegantPalette.emerald,
        disabled: 'transparent',
        disabledText: '#6B6B6B',
        disabledBorder: '#3D3D3D',
      },
      outline: {
        bg: 'transparent',
        hover: elegantPalette.terracotta + '20',
        active: elegantPalette.terracotta + '30',
        text: elegantPalette.terracottaLight,
        border: elegantPalette.terracotta,
      },
      danger: {
        bg: elegantPalette.terracotta,
        hover: elegantPalette.terracottaLight,
        active: elegantPalette.burgundy,
        text: '#FFFFFF',
      },
    },
    // Card styles (dark mode)
    card: {
      bg: colors.background.darkSecondary,
      border: elegantPalette.emerald + '25',
      shadow: shadows.darkElevation,
    },
    // Input styles (dark mode)
    input: {
      bg: colors.background.darkTertiary,
      border: elegantPalette.noirSoft,
      borderFocus: elegantPalette.emerald,
      placeholder: '#6B6B6B',
    },
    // Navigation (dark mode)
    nav: {
      bg: colors.background.darkSecondary,
      border: elegantPalette.emerald + '20',
      active: elegantPalette.emerald,
      hover: elegantPalette.emerald + '15',
    },
    // Badges (dark mode)
    badge: {
      gold: {
        bg: elegantPalette.terracotta + '25',
        text: elegantPalette.terracottaLight,
      },
      success: {
        bg: elegantPalette.emerald + '20',
        text: elegantPalette.emeraldLight,
      },
      warning: {
        bg: elegantPalette.terracotta + '25',
        text: elegantPalette.terracottaLight,
      },
      error: {
        bg: elegantPalette.burgundy + '30',
        text: elegantPalette.terracottaLight,
      },
      info: {
        bg: colors.accent.infoBlue + '25',
        text: colors.accent.infoBlueLight,
      },
    },
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  mode: 'dark' as const,
};

// ============================================
// TYPE EXPORTS
// ============================================
export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = 'light' | 'dark';
