import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ToastBase = ({ icon, color, text1, text2, borderColor }) => (
  <View style={[styles.toastContainer, { borderLeftColor: borderColor }]}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.contentWrapper}>
      {text1 && <Text style={styles.titleText}>{text1}</Text>}
      {text2 && <Text style={styles.messageText}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <ToastBase
      icon="checkmark-circle"
      color="#10B981"
      borderColor="#10B981"
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2 }) => (
    <ToastBase
      icon="close-circle"
      color="#EF4444"
      borderColor="#EF4444"
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2 }) => (
    <ToastBase
      icon="information-circle"
      color="#3B82F6"
      borderColor="#3B82F6"
      text1={text1}
      text2={text2}
    />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 6,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 6,
  },
  iconWrapper: {
    marginRight: 12,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'NotoSansMyanmar-Regular',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'NotoSansMyanmar-Regular',
    lineHeight: 20,
  },
});
