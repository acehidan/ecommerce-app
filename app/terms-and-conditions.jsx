import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>သဘောတူညီချက်များ</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* Parcel Notice Section */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <View style={styles.noticeIcon}>
              <Ionicons name="alert-circle" size={24} color="#FF0000" />
            </View>
            <Text style={styles.noticeTitle}>
              ပါဆယ်ထုတ်နဲ့ပက်သက်၍ သတိပြုရန်
            </Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                လာပို့သူ Deli ရှေ့တွင် ဖြစ်စေ
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                ရုံးတွင် ဖြစ်စေ ပစ္စည်းအနာအဆာ အရေအတွက်
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                တစ်ခါတည်း စစ်ဆေးပေးပါရန်
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                Error တစ်စုံတစ်ရာ ရှိပါက လာပို့သူ ( သို့မဟုတ် )
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                ရုံးတွင် ပစ္စည်းရွေးယူစရာ မလိုဘဲ Return
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                ပြန်ပေးပါရန် ။ရွေးယူပြီးမှ ဖြစ် ပေါ်လာသော
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                ကျိုးပဲ့ခြင်း ပစ္စည်းလျော့ခြင်း ဖြစ်ပေါ်လာပါက
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>
                ဆိုင်ဖက်မှ တာဝန်ယူမည် မဟုတ်ပါ။
              </Text>
            </View>
          </View>
          <View style={styles.thankYouSection}>
            <Ionicons name="heart" size={16} color="#FFD700" />
            <Text style={styles.thankYouText}>
              A ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်..
            </Text>
            <Ionicons name="heart" size={16} color="#FFD700" />
          </View>
        </View>

        {/* D.I.Y. Products Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <View style={styles.noticeIcon}>
              <Ionicons name="alert-circle" size={24} color="#FF0000" />
            </View>
            <Text style={styles.noticeText}>
              D.I.Y ပစ္စည်းများ တွင် အာမခံမပါဝင်ပါ။
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            * ပစ္စည်းများ ဝယ်ယူရာတွင် အထက်ဖော်ပြပါအချက်လက်များကို
            သဘောတူရန် လိုအပ်ပါတယ်။
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF0000',
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    flex: 1,
  },
  thankYouSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 8,
  },
  thankYouText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  disclaimer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  disagreeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disagreeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  agreeButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

