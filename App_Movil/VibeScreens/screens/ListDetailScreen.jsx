import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovies } from '../context/MovieContext';
import appFirebase from '../credenciales';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const ListDetailScreen = ({ route, navigation }) => {
  const { listId } = route.params;
  const { getListMovies, deleteList } = useMovies();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState('Mi Lista');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = getListMovies(currentUser.uid, listId, (moviesList) => {
        setMovies(moviesList);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [listId]);

  const handleMoviePress = (movie) => {
    // Navigate to movie or series detail in the HomeStack (Inicio tab)
    if (movie.type === 'tv') {
      navigation.navigate('Inicio', { screen: 'SeriesDetail', params: { seriesId: movie.movieId } });
    } else {
      navigation.navigate('Inicio', { screen: 'MovieDetail', params: { movieId: movie.movieId } });
    }
  };

  const handleDeleteList = async () => {
    console.log('handleDeleteList called');
    console.log('Delete confirmed');
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser);
    if (currentUser) {
      try {
        await deleteList(currentUser.uid, listId);
        console.log('List deleted, navigating back');
        navigation.goBack();
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('No se pudo eliminar la lista'); // Use alert for web
      }
    } else {
      console.log('No current user');
    }
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => handleMoviePress(item)}>
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.title) + '&background=1a1a2e&color=fff&size=150'
        }}
        style={styles.moviePoster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieDate}>
          Agregado: {item.addedAt?.toDate ? item.addedAt.toDate().toLocaleDateString() : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{listName}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteList}
        >
          <Ionicons name="trash" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      {movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovie}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="film-outline" size={64} color="#555" />
          <Text style={styles.emptyText}>Esta lista está vacía</Text>
          <Text style={styles.emptySubtext}>Agrega películas desde los detalles</Text>
        </View>
      )}
    </View>
  );
};

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  moviePoster: {
    width: 80,
    height: 120,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 12,
    color: '#aaa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ListDetailScreen;