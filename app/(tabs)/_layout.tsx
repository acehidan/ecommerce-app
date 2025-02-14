import { Tabs } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import CustomTabBar from './../components/CustomTabBar';

export default function TabLayout() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} totalItems={totalItems} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = {
  activeTabIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: 120,
    height: 50,
    color: 'white',
    // padding: 20,
    borderRadius: 50,
    zIndex: -1,
  },
  TabIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000000',
    width: 70,
    height: 50,
    color: 'white',
    borderWidth: 1, // Width of the border
    borderColor: '#gray', // Color of the border
    borderStyle: 'solid',
    borderRadius: 50,
    zIndex: -1,
  },
};
