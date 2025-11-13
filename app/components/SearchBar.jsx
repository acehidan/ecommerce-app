import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable SearchBar Component
 * @param {string} placeholder - Placeholder text for search input
 * @param {string} value - Search query value
 * @param {function} onChangeText - Handler for text changes
 * @param {string} hintText - Hint text below search bar
 * @param {boolean} showHint - Show hint text (default: true)
 * @param {function} onPress - Handler when search bar is pressed (for navigation)
 */
export default function SearchBar({
  placeholder = 'လိုချင်တဲ့ ပစ္စည်းတွေ ရှာမယ်',
  value,
  onChangeText,
  hintText = '* မိမိရှာလိုတဲ့ ပစ္စည်းရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်',
  showHint = true,
  onPress,
}) {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666666" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          value={value}
          onChangeText={onChangeText}
          onPressIn={onPress}
          editable={!onPress}
        />
      </View>
      {showHint && <Text style={styles.searchHint}>{hintText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  searchHint: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 10,
    lineHeight: 16,
  },
});
