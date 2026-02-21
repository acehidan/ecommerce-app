import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

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
  placeholder,
  value,
  onChangeText,
  hintText,
  showHint,
  onPress,
}) {
  const SearchBarContent = (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#666666" />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#666666"
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />
    </View>
  );

  return (
    <View style={styles.searchSection}>
      {onPress ? (
        <Pressable onPress={onPress} style={styles.searchBarContainer}>
          {SearchBarContent}
        </Pressable>
      ) : (
        SearchBarContent
      )}
      {showHint && <Text style={styles.searchHint}>{hintText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 60,
    marginHorizontal: 10,

  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text.primary,
  },
  searchHint: {
    textAlign: 'center',
    color: colors.text.muted,
    fontSize: 8,
    lineHeight: 16,
    marginTop: 4,
  },
});
