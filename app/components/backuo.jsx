import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          // borderTopWidth: 0,
          marginRight: 10,
          marginLeft: 10,
          borderRadius: 100,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 5,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={focused ? styles.activeTabIndicator : styles.TabIndicator}
            >
              <Ionicons
                name="home-outline"
                size={focused ? 20 : 25}
                color={focused ? '#ffffff' : '#000'}
              />
              {focused && (
                <Text style={{ color: focused ? '#fff' : '#000' }}>Home</Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={focused ? styles.activeTabIndicator : styles.TabIndicator}
            >
              <Ionicons
                name="search-outline"
                size={focused ? 20 : 25}
                color={focused ? '#ffffff' : '#000'}
              />
              {focused && (
                <Text style={{ color: focused ? '#fff' : '#000' }}>Search</Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={focused ? styles.activeTabIndicator : styles.TabIndicator}
            >
              <Ionicons name="cart-outline" size={30} color={color} />
              {focused && (
                <Text style={{ color: focused ? '#fff' : '#000' }}>Home</Text>
              )}
              {totalItems > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -10,
                    backgroundColor: '#FF3B30',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    {totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={focused ? styles.activeTabIndicator : styles.TabIndicator}
            >
              <Ionicons
                name="person-outline"
                size={focused ? 20 : 25}
                color={focused ? '#ffffff' : '#000'}
              />
              {focused && (
                <Text style={{ color: focused ? '#fff' : '#000' }}>
                  Profile
                </Text>
              )}
            </View>
          ),
        }}
      />
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
