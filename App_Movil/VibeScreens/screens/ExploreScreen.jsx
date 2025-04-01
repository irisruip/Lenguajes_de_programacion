import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_KEY = '<TU_API_KEY_AQUI>'; // TMDb API Key

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
          searchQuery
        )}&page=1`
      );
      const data = await response.json();
      // Filtrar solo películas y series
      const results = data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Error buscando películas y series:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleItemPress = (item) => {
    // Navegar a la pantalla de detalles con el ID y el tipo de contenido (movie o tv)
    navigation.navigate('MovieDetail', { movieId: item.id, mediaType: item.media_type });
  };

  const renderItem = ({ item }) => {
    // Para películas usamos title y release_date; para series usamos name y first_air_date
    const title = item.media_type === 'tv' ? item.name : item.title;
    const date =
      item.media_type === 'tv'
        ? item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : 'N/A'
        : item.release_date
        ? new Date(item.release_date).getFullYear()
        : 'N/A';

    return (
      <TouchableOpacity style={styles.movieItem} onPress={() => handleItemPress(item)}>
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/150x225?text=No+Image'
          }}
          style={styles.moviePoster}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.movieYear}>{date}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffd700" />
            <Text style={styles.ratingText}>
              {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar películas y series..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsList}
        />
      ) : searchQuery.length > 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#555" />
          <Text style={styles.noResultsText}>
            No se encontraron resultados para "{searchQuery}"
          </Text>
        </View>
      ) : (
        <View style={styles.initialStateContainer}>
          <Ionicons name="film-outline" size={64} color="#555" />
          <Text style={styles.initialStateText}>Busca tus películas y series favoritas</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  clearButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  moviePoster: {
    width: 100,
    height: 150,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  movieYear: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialStateText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 16,
  },
});

export default ExploreScreen;
