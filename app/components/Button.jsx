import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../constants/colors';

/**
 * Reusable Button Component
 * @param {string} title - Button text
 * @param {function} onPress - Press handler function
 * @param {string} variant - Button style variant: 'outline' | 'filled' | 'text'
 * @param {string} size - Button size: 'small' | 'medium' | 'large'
 * @param {boolean} loading - Show loading indicator
 * @param {boolean} disabled - Disable button
 * @param {object} style - Additional custom styles
 * @param {object} textStyle - Additional custom text styles
 * @param {string} borderColor - Custom border color (for outline variant)
 * @param {string} textColor - Custom text color
 * @param {string} backgroundColor - Custom background color (for filled variant)
 */
export default function Button({
  title,
  onPress,
  variant = 'outline', // 'outline', 'filled', 'text'
  size = 'medium', // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  style,
  textStyle,
  borderColor,
  textColor,
  backgroundColor,
}) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];

    if (variant === 'outline') {
      baseStyle.push(styles.buttonOutline);
      if (borderColor) {
        baseStyle.push({ borderColor });
      }
    } else if (variant === 'filled') {
      baseStyle.push(styles.buttonFilled);
      if (backgroundColor) {
        baseStyle.push({ backgroundColor });
      }
    } else if (variant === 'text') {
      baseStyle.push(styles.buttonText);
    }

    if (isDisabled) {
      baseStyle.push(styles.buttonDisabled);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`text_${size}`]];

    if (variant === 'outline') {
      baseTextStyle.push(styles.textOutline);
      if (textColor || borderColor) {
        baseTextStyle.push({
          color: textColor || borderColor || colors.text.light,
        });
      }
    } else if (variant === 'filled') {
      baseTextStyle.push(styles.textFilled);
      if (textColor) {
        baseTextStyle.push({ color: textColor });
      }
    } else if (variant === 'text') {
      baseTextStyle.push(styles.textText);
      if (textColor) {
        baseTextStyle.push({ color: textColor });
      }
    }

    if (isDisabled) {
      baseTextStyle.push(styles.textDisabled);
    }

    if (textStyle) {
      baseTextStyle.push(textStyle);
    }

    return baseTextStyle;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline'
              ? textColor || borderColor || colors.text.light
              : variant === 'filled'
              ? textColor || colors.text.light
              : textColor || colors.text.primary
          }
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  // Size variants
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  // Variant styles
  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.text.light,
    backgroundColor: 'transparent',
  },
  buttonFilled: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  buttonText: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  // States
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  // Text styles
  text: {
    fontFamily: 'NotoSansMyanmar-Regular',
    fontWeight: '700',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 10,
  },
  text_medium: {
    fontSize: 12,
  },
  text_large: {
    fontSize: 14,
  },
  textOutline: {
    color: colors.text.light,
  },
  textFilled: {
    color: colors.text.light,
  },
  textText: {
    color: colors.text.primary,
  },
  textDisabled: {
    opacity: 0.6,
  },
});
