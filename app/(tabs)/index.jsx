import { ScrollView, StyleSheet } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivals from '../components/NewArrivals';

export default function Home() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16; // Tab bar height + bottom inset + padding

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Navbar title="OTAS Demo" />
        <SearchBar />
        <PromotionalBanner />
        <CategoriesSection />
        <NewArrivals />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
