import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  return (
    <View style={styles.navbar as ViewStyle}>
      <Text style={styles.homePageText as TextStyle}>Home Page</Text>
      <View style={styles.navbarContent as ViewStyle}>
        <Text style={styles.appTitle as TextStyle}>
          ကိုမင်း D.I.Y ပစ္စည်းများ
        </Text>
        <View style={styles.profileSection as ViewStyle}>
          <View style={styles.profileIcon as ViewStyle}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge as ViewStyle}>
              <Text style={styles.badgeText as TextStyle}>2</Text>
            </View>
          </View>
          {/* <View style={styles.notificationDot as ViewStyle}>
            <Text style={styles.notificationText as TextStyle}>1</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    // paddingTop: 10,
    paddingBottom: 20,
  } as ViewStyle,
  homePageText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  } as TextStyle,
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  appTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  } as TextStyle,
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  profileIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  } as TextStyle,
  notificationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  } as TextStyle,
});
