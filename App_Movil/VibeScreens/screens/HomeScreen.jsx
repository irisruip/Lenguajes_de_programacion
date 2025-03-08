import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMovies } from '../context/MovieContext';
import { Ionicons } from '@expo/vector-icons';

const MoviePoster = ({ movie, onPress }) => {
  return (
    <TouchableOpacity style={styles.posterContainer} onPress={onPress}>
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/150x225?text=No+Image'
        }}
        style={styles.poster}
      />
    </TouchableOpacity>
  );
};

const MovieCollection = ({ title, movies = [], onMoviePress }) => {
  // Añadimos un valor por defecto de array vacío para movies
  if (!movies || movies.length === 0) {
    return (
      <View style={styles.collectionContainer}>
        <Text style={styles.collectionTitle}>{title}</Text>
        <View style={styles.emptyCollection}>
          <Text style={styles.emptyText}>Cargando películas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.collectionContainer}>
      <Text style={styles.collectionTitle}>{title}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MoviePoster movie={item} onPress={() => onMoviePress(item)} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const UserReview = ({ review }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40x40' }}
          style={styles.reviewAvatar}
        />
        <View>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= review.rating ? 'star' : 'star-outline'}
                size={14}
                color="#ffd700"
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.reviewContent} numberOfLines={3}>
        {review.content}
      </Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>leer más...</Text>
      </TouchableOpacity>
    </View>
  );
};

// Datos de ejemplo para las reseñas
const sampleReviews = [
  {
    id: 1,
    author: 'Barbie',
    rating: 4,
    content: 'Margot Robbie is amazing in this movie. I loved the action scenes and the soundtrack. Can\'t wait for the sequel! Also, Ryan Gosling is a great Ken and a great actor when he sings I pissed off.'
  },
  {
    id: 2,
    author: 'Zack Snyder\'s Justice League',
    rating: 2,
    content: 'Pues a mí no me gustó, pero a mi amigo Rodrigo sí. No sé, cada quien tiene su opinión, supongo. La mejor parte fue cuando apareció el Joker de Jared Leto, eso sí fue inesperado.'
  },
  {
    id: 3,
    author: 'tick, tick...BOOM!',
    rating: 5,
    content: 'Andrew Garfield gives the performance of his career in this musical biopic about Jonathan Larson, the creator of Rent who tragically died before its premiere.'
  }
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    trendingMovies,
    monthlyMovies,
    isLoading,
    error,
    refreshMovies
  } = useMovies();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshMovies();
    setRefreshing(false);
  }, [refreshMovies]);

  const handleMoviePress = (movie) => {
    //Aquí iría la navegación a la pantalla de detalles de la película
    console.log('Movie selected:', movie.title);
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshMovies}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff6b6b" />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido Juan!</Text>
          <Text style={styles.username}>
            Juan Andres, si ves esto, ve Alice in Borderland (Mensaje de Iris)
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      <MovieCollection
        title="Películas populares"
        movies={trendingMovies ? trendingMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />

      <MovieCollection
        title="Películas del mes"
        movies={monthlyMovies ? monthlyMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />

      <View style={styles.collectionContainer}>
        <Text style={styles.collectionTitle}>Reseñas</Text>
        <FlatList
          data={sampleReviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <UserReview review={item} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

//Estilos provicionales, se pasarán luego a un ThemeProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    color: '#aaa',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptyCollection: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
  },
  posterContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  reviewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewContent: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    color: '#ff6b6b',
    fontSize: 14,
  },
});

export default HomeScreen;