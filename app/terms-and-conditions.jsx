import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PageHeader from './components/PageHeader';
import colors from '../constants/colors';

export default function TermsAndConditions() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;

  const handleDisagree = () => {
    router.back();
  };

  const handleAgree = () => {
    router.push('/checkout-step1');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <PageHeader title="သဘောတူညီချက်များ" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* Parcel Notice Section */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <View style={[styles.noticeIcon, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.badgeText}>၁</Text>
            </View>
            <Text style={styles.noticeTitle}>
              ပါဆယ်ထုတ်နဲ့ပက်သက်၍ သတိပြုရန်
            </Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.customBullet} />
              <Text style={styles.bulletText}>
                လာပို့သူ Deli ရှေ့တွင် ဖြစ်စေ ရုံးတွင် ဖြစ်စေ ပစ္စည်းအနာအဆာ
                အရေအတွက် တစ်ခါတည်း စစ်ဆေးပေးပါရန်
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.customBullet} />
              <Text style={styles.bulletText}>
                Error တစ်စုံတစ်ရာ ရှိပါက လာပို့သူ ( သို့မဟုတ် ) ရုံးတွင်
                ပစ္စည်းရွေးယူစရာ မလိုဘဲ Return ပြန်ပေးပါရန် ။ရွေးယူပြီးမှ ဖြစ်
                ပေါ်လာသော ကျိုးပဲ့ခြင်း ပစ္စည်းလျော့ခြင်း ဖြစ်ပေါ်လာပါက
                ဆိုင်ဖက်မှ တာဝန်ယူမည် မဟုတ်ပါ။
              </Text>
            </View>
          </View>
          <View style={styles.thankYouLine}>
            <Text style={styles.thankYouTextWithEmoji}>
              🙏 ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်။ 🙏
            </Text>
          </View>
        </View>

        {/* D.I.Y. Products Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <View style={[styles.noticeIcon, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.badgeText}>၂</Text>
            </View>
            <Text style={styles.noticeTitle}>
              D.I.Y ပစ္စည်းများ တွင် အာမခံမပါဝင်ပါ။
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            * ပစ္စည်းများ ဝယ်ယူရာတွင် အထက်ဖော်ပြပါအချက်လက်များကို သဘောတူရန်
            လိုအပ်ပါတယ်။
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.disagreeButton} onPress={handleDisagree}>
          <Text style={styles.disagreeButtonText}>မတူပါ</Text>
        </Pressable>
        <Pressable style={styles.agreeButton} onPress={handleAgree}>
          <Text style={styles.agreeButtonText}>သဘောတူပါတယ်</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  noticeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,

  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
  },
  noticeIcon: {
    width: 20,
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansMyanmar-Regular',
    fontWeight: '700',
    color: colors.black,
    flex: 1,

  },
  bulletList: {
    marginLeft: 4,
    marginVertical: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4B2B',
    marginTop: 6,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFD1C9',
  },
  bulletText: {
    fontSize: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.black,
    lineHeight: 24,
    flex: 1,
    fontWeight: '500',
  },
  thankYouLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  thankYouTextWithEmoji: {
    fontSize: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.black,
    fontWeight: '600',
  },
  disclaimer: {
    paddingHorizontal: 40,
    paddingVertical: 32,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: colors.background.secondary,

  },
  disagreeButton: {
    height: 58,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.background.secondary,
    borderRadius: 50,
    paddingHorizontal: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  disagreeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
  },
  agreeButton: {
    flex: 1,
    backgroundColor: colors.black,
    borderRadius: 50,
    height: 58,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});
