import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivals from '../components/NewArrivals';

export default function Home() {
  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <ScrollView style={styles.scrollView as ViewStyle}>
        <Navbar />
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
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
});
