import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Text, Card, IconButton, Searchbar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites, QuestionAnswer } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation();

  const filteredFavorites = favorites.filter(fav => 
    fav.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewAnswer = (item: QuestionAnswer) => {
    navigation.navigate('Answer', { questionData: item });
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this question from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeFavorite(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="star-outline" size={80} color={theme.colors.secondary} />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        {searchQuery.length > 0 
          ? "No favorites match your search" 
          : "You haven't saved any favorites yet"}
      </Text>
      {searchQuery.length === 0 && (
        <Text style={[styles.emptySubtext, { color: theme.colors.secondary }]}>
          Save questions from the answer screen to access them here
        </Text>
      )}
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: QuestionAnswer }) => (
    <Card 
      style={[styles.favoriteCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleViewAnswer(item)}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={[styles.questionText, { color: theme.colors.text }]} numberOfLines={2}>
            {item.question}
          </Text>
          <IconButton
            icon="trash-can-outline"
            iconColor={theme.colors.error}
            size={20}
            onPress={() => confirmDelete(item.id)}
            style={styles.deleteButton}
          />
        </View>
        
        <Text style={[styles.answerPreview, { color: theme.colors.secondary }]} numberOfLines={2}>
          {item.answer}
        </Text>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.dateText, { color: theme.colors.secondary }]}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          <Text style={[styles.regionText, { color: theme.colors.secondary }]}>
            {item.region.country}{item.region.state ? `, ${item.region.state}` : ''}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search favorites"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.card }]}
          iconColor={theme.colors.primary}
          inputStyle={{ color: theme.colors.text }}
        />
      </View>

      {favorites.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: theme.colors.secondary }]}>
            {filteredFavorites.length} {filteredFavorites.length === 1 ? 'favorite' : 'favorites'}
            {searchQuery.length > 0 ? ' found' : ''}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          filteredFavorites.length === 0 && styles.emptyListContent
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 8,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  favoriteCard: {
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginBottom: 8,
  },
  deleteButton: {
    margin: -8,
  },
  answerPreview: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  regionText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});