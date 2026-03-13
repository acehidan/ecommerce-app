import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const DeliveryZoneErrorModal = ({ visible, onClose, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="map-marker-off-outline"
              size={60}
              color={colors.error.main}
            />
          </View>

          <Text style={styles.title}>ပို့ဆောင်၍ မရသေးပါ</Text>

          <Text style={styles.message}>
            {message || 'လက်ရှိ ရွေးချယ်ထားသော မြို့နယ်သို့ ပို့ဆောင်၍မရသေးပါ။ ကျေးဇူးပြု၍ အခြားလိပ်စာတစ်ခု ထပ်မံရွေးချယ်ပေးပါ။'}
          </Text>

          <Pressable
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>နားလည်ပါပြီ</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    width: width * 0.85,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.error.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  message: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  button: {
    backgroundColor: colors.button.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
});

export default DeliveryZoneErrorModal;
