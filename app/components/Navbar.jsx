import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export default function Navbar({ title }) {
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <Text style={styles.appTitle}>{title}</Text>
        {/* <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  navbarContent: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: colors.text.primary,
    fontSize: 20,
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
    backgroundColor: colors.text.secondary,
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
    backgroundColor: colors.accent.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.text.light,
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: colors.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
