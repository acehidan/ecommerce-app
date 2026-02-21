import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

/**
 * Reusable Loading State component
 * 
 * @param {Object} props
 * @param {number} props.headerHeight - Optional height adjustment for sticky headers or safe area
 * @param {string} props.message - Optional message to display
 * @param {string} props.color - Optional activity indicator color
 */
const LoadingState = ({ headerHeight = 0, message = 'ခဏစောင့်ဆိုင်းပေးပါ..', color = colors.primary }) => (
    <View style={[styles.centerContainer, { paddingTop: headerHeight }]}>
        <ActivityIndicator size="large" color={color} />
        <Text style={styles.statusText}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: colors.background.primary,
    },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        color: colors.text.tertiary,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default LoadingState;
