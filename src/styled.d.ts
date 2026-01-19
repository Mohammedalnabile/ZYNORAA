import 'styled-components';
import { lightTheme, darkTheme, colors, typography, spacing, borderRadius, shadows, breakpoints, transitions, zIndex, elegantPalette, goldPalette } from './styles/theme';

// Create a base theme interface that works for both light and dark
interface ThemeColors {
  primary: typeof colors.primary;
  neutral: typeof colors.neutral;
  secondary: typeof colors.secondary;
  accent: typeof colors.accent;
  background: typeof colors.background;
  trust: typeof colors.trust;
  status: typeof colors.status;
  gold: typeof goldPalette;
  elegant: typeof elegantPalette;
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    gold?: string;
  };
  button: {
    primary: {
      bg: string;
      hover: string;
      active: string;
      text: string;
      disabled: string;
      disabledText: string;
    };
    secondary: {
      bg: string;
      hover: string;
      active: string;
      text: string;
      border: string;
      disabled: string;
      disabledText: string;
      disabledBorder: string;
    };
    outline: {
      bg: string;
      hover: string;
      active: string;
      text: string;
      border: string;
    };
    danger?: {
      bg: string;
      hover: string;
      active: string;
      text: string;
    };
  };
  card: {
    bg: string;
    border: string;
    shadow: string;
  };
  input: {
    bg: string;
    border: string;
    borderFocus: string;
    placeholder: string;
  };
  nav: {
    bg: string;
    border: string;
    active: string;
    hover: string;
    linkHoverBg?: string;
  };
  badge: {
    gold: { bg: string; text: string; };
    success: { bg: string; text: string; };
    warning: { bg: string; text: string; };
    error: { bg: string; text: string; };
    info: { bg: string; text: string; };
  };
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ThemeColors;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
    breakpoints: typeof breakpoints;
    transitions: typeof transitions;
    zIndex: typeof zIndex;
    mode: 'light' | 'dark';
  }
}
