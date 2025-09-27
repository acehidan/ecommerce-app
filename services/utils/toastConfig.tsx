import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successToast}>
      <View style={styles.toastIconContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      </View>
      <View style={styles.toastTextContainer}>
        {/* <Text style={styles.toastTitle}>{text1}</Text> */}
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.errorToast}>
      <View style={styles.toastIconContainer}>
        <Ionicons name="close-circle" size={24} color="#F44336" />
      </View>
      <View style={styles.toastTextContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastIconContainer: {
    marginRight: 12,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
});
