import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import handleGetAllCategory from '../../services/products/getAllCategory';
import Navbar from '../components/Navbar';
import colors from '../../constants/colors';

export default function Search() {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;

  const loadCategories = async () => {
    try {
      const response = await handleGetAllCategory();
      if (response.success) {
        const categoryOptions = response.data.data.items.map((item, index) => ({
          id: item._id || index + 1,
          name: item.category,
          value: item.category,
        }));
        setCategories(categoryOptions);
      }
    } catch (error) {

      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = async () => {
    if (!itemName.trim() && !selectedCategory) {
      Alert.alert('Please enter a search query');
      return;
    }

    // Navigate to search results page with search parameters
    const searchParams = {
      query: itemName.trim() || "",
      category: selectedCategory,
    };

    router.push({
      pathname: '/search-results',
      params: searchParams,
    });
  };

  const clearSearch = () => {
    setItemName('');
    setSelectedCategory('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Navbar title="ပစ္စည်း တွေရှာမယ်" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Name Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="document-text" size={20} color="#666666" />
            <Text style={styles.fieldLabel}>ပစ္စည်းနာမည်</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="ဉပမာ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး"
              value={itemName}
              onChangeText={setItemName}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Item Type Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="pricetag" size={20} color="#666666" />
            <Text style={styles.fieldLabel}>ပစ္စည်းအမျိုးအစား</Text>
          </View>
          <Pressable
            style={styles.inputContainer}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text
              style={
                selectedCategory ? styles.selectedText : styles.placeholderText
              }
            >
              {selectedCategory || 'ရှာလို့နဲ့ ပစ္စည်းအမျိုးအစားကို ရွေးချယ်ပါ'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </Pressable>

          {showCategoryDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView style={styles.dropdownScroll}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{category.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Search Results */}
      {/* {hasSearched && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              ရှာဖွေမှုရလဒ်များ ({searchResults.length})
            </Text>
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>ရှင်းလင်းမယ်</Text>
            </Pressable>
          </View>

          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>ရှာဖွေနေသည်...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable style={styles.resultItem}>
                  <View style={styles.resultImageContainer}>
                    {item.images && item.images.length > 0 ? (
                      <Image
                        source={{ uri: item.images[0].url }}
                        style={styles.resultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.noImageContainer}>
                        <Ionicons
                          name="image-outline"
                          size={40}
                          color="#CCCCCC"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultCategory}>{item.category}</Text>
                    <Text style={styles.resultPrice}>
                      MMK {item.retailUnitPrice.toLocaleString()}
                    </Text>
                    <Text style={styles.resultStock}>
                      လက်ကျန်ရှိမှု: {item.stockQuantity}{' '}
                      {item.retailQuantity > 1 ? 'ခု' : 'ခု'}
                    </Text>
                  </View>
                </Pressable>
              )}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={60} color="#CCCCCC" />
              <Text style={styles.noResultsText}>ရှာဖွေမှုရလဒ်မရှိပါ</Text>
              <Text style={styles.noResultsSubtext}>
                အခြားစကားလုံးများဖြင့် ပြန်လည်ရှာဖွေကြည့်ပါ
              </Text>
            </View>
          )}
        </View>
      )} */}

      {/* Search Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.searchButton,
            isSearching && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Text style={styles.searchButtonText}>ရှာဖွေနေသည်...</Text>
          ) : (
            <Text style={styles.searchButtonText}>ပစ္စည်းရှာမယ်</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.primary.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  inputContainer: {
    borderRadius: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
    marginBottom: 60,
  },
  searchButton: {
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButtonDisabled: {
    backgroundColor: colors.background.secondary,
  },
  selectedText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background.secondary,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.text.primary,
  },

});
