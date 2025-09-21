import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

const CATEGORIES = [
  {
    id: 1,
    name: 'Capacitor',
    slug: 'capacitor',
  },
  {
    id: 2,
    name: 'D.I.Y အလှဆင် Kits များ',
    slug: 'diy-decoration-kits',
  },
  {
    id: 3,
    name: 'Electronics',
    slug: 'electronics',
  },
  {
    id: 4,
    name: 'Resistors',
    slug: 'resistors',
  },
  {
    id: 5,
    name: 'LEDs',
    slug: 'leds',
  },
  {
    id: 6,
    name: 'Arduino',
    slug: 'arduino',
  },
  {
    id: 7,
    name: 'Sensors',
    slug: 'sensors',
  },
  {
    id: 8,
    name: 'Motors',
    slug: 'motors',
  },
];

export default function CategoriesSection() {
  const handleShopNow = (slug: string) => {
    router.push(`/collection/${slug}`);
  };

  return (
    <View style={styles.section as ViewStyle}>
      <View style={styles.categoriesHeader as ViewStyle}>
        <Text style={styles.sectionTitle as TextStyle}>
          ပစ္စည်းအမျိူးအစားများ
        </Text>
        <Pressable style={styles.viewAllButton as ViewStyle}>
          <Text style={styles.viewAllText as TextStyle}>အမျိုးအစားများ</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContainer as ViewStyle}
        style={styles.categoriesScrollView as ViewStyle}
      >
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={styles.categoryButton as ViewStyle}
            onPress={() => handleShopNow(category.slug)}
          >
            <Text style={styles.categoryButtonText as TextStyle}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    backgroundColor: '#0B231C',
  } as ViewStyle,
  categoriesHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  } as TextStyle,
  viewAllButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  } as ViewStyle,
  viewAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  } as TextStyle,
  categoriesScrollView: {
    paddingLeft: 20,
    marginTop: 8,
  } as ViewStyle,
  categoriesScrollContainer: {
    paddingHorizontal: 2,
    gap: 12,
  } as ViewStyle,
  categoryButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    marginRight: 12,
  } as ViewStyle,
  categoryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  } as TextStyle,
});
