import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Easing } from 'react-native';
import colors from '../../constants/colors';

// --- Configuration Constants ---

const TAB_ICONS = {
  index: { active: 'home', inactive: 'home-outline' },
  categories: { active: 'grid', inactive: 'grid-outline' },
  search: { active: 'search', inactive: 'search-outline' },
  cart: { active: 'basket', inactive: 'basket-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS = {
  index: 'ပင်မ',
  categories: 'အမျိုးအစားများ',
  search: 'ရှာမည်',
  cart: 'စျေးခြင်း',
  profile: 'မိမိအကောင့်',
};

// --- Helper Components/Functions ---

const TabIcon = ({ name, color, size, focused }) => {
  const iconName = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
  return <Ionicons name={iconName} size={size} color={color} />;
};

// --- TabLayout Component ---

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const getScreenOptions = () => ({
    headerShown: false,
    tabBarHideOnKeyboard: true,
    animation: 'shift',
    tabBarStyle: {
      backgroundColor: colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      height: 60 + insets.bottom,
      paddingBottom: insets.bottom + 8,
      paddingTop: 8,
      position: 'absolute',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    tabBarActiveTintColor: colors.text.primary,
    tabBarInactiveTintColor: colors.text.muted,
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'NotoSansMyanmar-Regular',
      marginTop: 2,
    },
    tabBarShowLabel: true,
    tabBarVisibilityAnimationConfig: {
      show: {
        animation: 'timing',
        config: {
          duration: 250,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        },
      },
      hide: {
        animation: 'timing',
        config: {
          duration: 200,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        },
      },
    },
  });

  return (
    <Tabs screenOptions={getScreenOptions()}>
      {Object.keys(TAB_ICONS).map((tabName) => (
        <Tabs.Screen
          key={tabName}
          name={tabName}
          options={{
            title: TAB_LABELS[tabName],
            tabBarIcon: (props) => <TabIcon name={tabName} {...props} />,
          }}
        />
      ))}
    </Tabs>
  );
}
