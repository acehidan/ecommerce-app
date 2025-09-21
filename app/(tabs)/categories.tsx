import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  {
    id: 1,
    name: 'Capacitor များ',
    itemCount: 342,
  },
  {
    id: 2,
    name: 'D.I.Y အလှဆင် Kits များ',
    itemCount: 56,
  },
  {
    id: 3,
    name: 'အိမ်တွင်းအလှဆင်ပစ္စည်းများ',
    itemCount: 401,
  },
  {
    id: 4,
    name: 'တိုလီမိုလီသိမ်းရန် အံဆွဲများ',
    itemCount: 86,
  },
  {
    id: 5,
    name: 'ဘက်ထရီများ',
    itemCount: 572,
  },
  {
    id: 6,
    name: 'လူသုံးကုန် လျှပ်စစ် ပစ္စည်းများ',
    itemCount: 216,
  },
  {
    id: 7,
    name: 'ပါဝါဘဏ်များ',
    itemCount: 89,
  },
  {
    id: 8,
    name: 'LED မီးလုံးများ',
    itemCount: 124,
  },
  {
    id: 9,
    name: 'ကြိုးများ',
    itemCount: 78,
  },
  {
    id: 10,
    name: 'ဆော့ဖ်ဝဲများ',
    itemCount: 45,
  },
];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(CATEGORIES);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCategories(CATEGORIES);
    } else {
      const filtered = CATEGORIES.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/collection/${categoryId}`);
  };

  const renderCategory = ({ item }: { item: (typeof CATEGORIES)[0] }) => (
    <Pressable
      style={styles.categoryItem as ViewStyle}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View style={styles.categoryContent as ViewStyle}>
        <View style={styles.categoryInfo as ViewStyle}>
          <Text style={styles.categoryName as TextStyle}>{item.name}</Text>
          <Text style={styles.categoryCount as TextStyle}>
            ပစ္စည်း စုစုပေါင်း - {item.itemCount} ခု
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      {/* Header */}
      <View style={styles.header as ViewStyle}>
        <Text style={styles.headerTitle as TextStyle}>
          ပစ္စည်း အမျိုးအစားများ
        </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection as ViewStyle}>
        <View style={styles.searchBar as ViewStyle}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput as TextStyle}
            placeholder="အမျိုးအစားတွေ ရှာမယ်"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Text style={styles.searchHint as TextStyle}>
          * မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို
          ရိုက်ပြီးရှာနိုင်ပါတယ်
        </Text>
      </View>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.categoriesList as ViewStyle}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={styles.separator as ViewStyle} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  } as TextStyle,
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  } as ViewStyle,
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  } as ViewStyle,
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
  searchHint: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  } as TextStyle,
  categoriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  } as ViewStyle,
  categoryItem: {
    paddingVertical: 16,
  } as ViewStyle,
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  categoryInfo: {
    flex: 1,
  } as ViewStyle,
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  } as TextStyle,
  categoryCount: {
    fontSize: 14,
    color: '#666666',
  } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginLeft: 0,
  } as ViewStyle,
});
