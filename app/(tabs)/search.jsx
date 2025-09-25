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
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import handleGetAllCategory from '../../services/products/getAllCategory';
import handleGetStocks from '../../services/products/getStocks';
import Navbar from '../components/Navbar';

export default function Search() {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [storageType, setStorageType] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

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

  const handleSearch = async () => {
    if (!itemName.trim() && !selectedCategory) {
      return;
    }

    // Navigate to search results page with search parameters
    const searchParams = {
      query: itemName.trim() || selectedCategory,
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

      <ScrollView style={styles.content}>
        {/* Item Name Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="document-text" size={20} color="#666666" />
            <Text style={styles.fieldLabel}>ပစ္စည်းနာမည်</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="ဉပမာ : ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့"
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

        {/* Storage Type Field */}
        {/* <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="business" size={20} color="#666666" />
            <Text style={styles.fieldLabel}>သိုလှောင်မှု အမျိုးအစား</Text>
          </View>
          <View style={styles.radioContainer}>
            <Pressable
              style={styles.radioOption}
              onPress={() => setStorageType('in-store')}
            >
              <View style={styles.radioButton}>
                {storageType === 'in-store' && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>ဆိုင်မှာပစ္စည်းရှိ</Text>
            </Pressable>
            <Pressable
              style={styles.radioOption}
              onPress={() => setStorageType('pre-order')}
            >
              <View style={styles.radioButton}>
                {storageType === 'pre-order' && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>ကြိုတင်မှာယူ</Text>
            </Pressable>
          </View>
        </View> */}
      </ScrollView>

      {/* Search Results */}
      {hasSearched && (
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
              <ActivityIndicator size="large" color="#007AFF" />
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
      )}

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
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
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
    color: '#000000',
    marginLeft: 8,
  },
  inputContainer: {
    borderRadius: 12,
    // paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
    flex: 1,
  },
  radioContainer: {
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioLabel: {
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  searchButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  selectedText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 8,
    maxHeight: 200,
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
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000000',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  resultStock: {
    fontSize: 12,
    color: '#666666',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
