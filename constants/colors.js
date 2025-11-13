/**
 * Color Theme Constants
 * Centralized color definitions for the entire app
 */

export const colors = {
  // Primary Colors
  primary: '#0B231C', // Dark green - main brand color
  primaryLight: '#2D5A27', // Lighter green variant
  primaryDark: '#051510', // Darker green variant

  // Secondary Colors
  secondary: '#F5F5F5', // Light gray - used for backgrounds
  secondaryLight: '#FFFFFF', // White
  secondaryDark: '#E5E5E5', // Border gray

  // Text Colors
  text: {
    primary: '#000000', // Black - main text
    secondary: '#333333', // Dark gray - secondary text
    tertiary: '#666666', // Medium gray - tertiary text
    light: '#FFFFFF', // White text
    muted: '#999999', // Muted gray text
  },

  // Background Colors
  background: {
    primary: '#FFFFFF', // White background
    secondary: '#F5F5F5', // Light gray background
    dark: '#0B231C', // Dark green background
    overlay: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
    darkOverlay: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black overlay
  },

  // Status Colors
  success: {
    main: '#4CAF50', // Success green
    light: '#E8F5E8', // Light success background
    dark: '#34C759', // Dark success
  },

  error: {
    main: '#F44336', // Error red
    light: '#FFEBEE', // Light error background
    dark: '#FF6B6B', // Dark error
  },

  warning: {
    main: '#FF9800', // Warning orange
    light: '#FFF3E0', // Light warning background
    dark: '#F57C00', // Dark warning
  },

  info: {
    main: '#2196F3', // Info blue
    light: '#E3F2FD', // Light info background
    dark: '#1976D2', // Dark info
  },

  // Accent Colors
  accent: {
    blue: '#007AFF', // iOS blue
    blueAlt: '#3B82F6', // Alternative blue
    green: '#34C759', // Green accent
    red: '#FF0000', // Red accent
  },

  // Border Colors
  border: {
    light: '#E5E5E5', // Light border
    medium: '#CCCCCC', // Medium border
    dark: '#999999', // Dark border
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)', // Light shadow
    medium: 'rgba(0, 0, 0, 0.2)', // Medium shadow
    dark: 'rgba(0, 0, 0, 0.3)', // Dark shadow
  },

  // Common UI Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Export individual color groups for convenience
export const {
  primary,
  primaryLight,
  primaryDark,
  secondary,
  secondaryLight,
  secondaryDark,
  text,
  background,
  success,
  error,
  warning,
  info,
  accent,
  border,
  shadow,
  white,
  black,
  transparent,
} = colors;

// Default export
export default colors;
