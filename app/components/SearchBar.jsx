import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666666" />
        <TextInput
          style={styles.searchInput}
          placeholder="လိုချင်တဲ့ ပစ္စည်းတွေ ရှာမယ်"
          placeholderTextColor="#666666"
        />
      </View>
      <Text style={styles.searchHint}>
        * မိမိရှာလိုတဲ့ ပစ္စည်းရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို
        ရိုက်ပြီးရှာနိုင်ပါတယ်
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
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
