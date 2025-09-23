import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivals from '../components/NewArrivals';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Navbar title="ကိုမင်း D.I.Y ပစ္စည်းများ" />
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
});
