import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ActivityIndicator,
} from 'react-native';
import colors from '../../constants/colors';

export default function OrderLoadingModal({ visible }) {
    if (!visible) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => { }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color={colors.button.primary} />
                    <Text style={styles.modalTitle}>အော်ဒါတင်နေပါသည်</Text>
                    <Text style={styles.modalMessage}>
                        ခဏစောင့်ဆိုင်းပေးပါ...
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 9999,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 35,
        width: '85%',
        maxWidth: 320,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'NotoSansMyanmar-Regular',
    },
    modalMessage: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        fontFamily: 'NotoSansMyanmar-Regular',
    },
});
