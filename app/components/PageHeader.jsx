import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

/**
 * Reusable Page Header Component
 * @param {string} title - Header title text
 * @param {function} onBackPress - Custom back button handler (defaults to router.back())
 * @param {string|number|ReactNode} rightContent - Content to display on the right side (e.g., count, text, custom component)
 * @param {boolean} showBorder - Show bottom border (default: true)
 * @param {boolean} sticky - Make header sticky at top (default: true)
 * @param {string} backIconColor - Back icon color (default: colors.text.primary)
 * @param {object} style - Additional custom styles for header container
 * @param {object} titleStyle - Additional custom styles for title
 * @param {object} rightContentStyle - Additional custom styles for right content
 */
export default function PageHeader({
  title,
  onBackPress,
  rightContent,
  showBorder = true,
  sticky = true,
  backIconColor = colors.text.primary,
  style,
  titleStyle,
  rightContentStyle,
}) {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const headerStyle = [
    styles.header,
    sticky && [styles.stickyHeader, { top: insets.top }],
    showBorder && styles.headerWithBorder,
    style,
  ];

  return (
    <View style={headerStyle}>
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color={backIconColor} />
      </Pressable>
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      <View style={[styles.rightContent, rightContentStyle]}>
        {typeof rightContent === 'string' ||
        typeof rightContent === 'number' ? (
          <Text style={styles.rightText}>{rightContent}</Text>
        ) : rightContent ? (
          rightContent
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.primary,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    marginLeft: 10,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  rightContent: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  rightText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'right',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  placeholder: {
    width: 80,
  },
});
