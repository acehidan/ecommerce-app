import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.homePageText}>Home Page</Text>
      <View style={styles.navbarContent}>
        <Text style={styles.appTitle}>ကိုမင်း D.I.Y ပစ္စည်းများ</Text>
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  homePageText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
