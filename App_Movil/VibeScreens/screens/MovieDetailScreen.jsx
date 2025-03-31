import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovies } from '../context/MovieContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { getMovieDetails } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovie(details);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('No se pudieron cargar los detalles de la película');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Ocurrió un error inesperado'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //Calcular el año de lanzamiento
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  //Formatear la duración en horas y minutos
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  //Obtener los géneros
  const genres = movie.genres || [];

  // Obtener el director
  const director = movie.credits?.crew?.find(person => person.job === 'Director');

  //Obtener el reparto
  const cast = movie.credits?.cast || [];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/*Botón de regreso*/}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {/*Background*/}
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                : 'https://via.placeholder.com/1280x720?text=No+Image'
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} // Ajusta la opacidad (último valor)
            locations={[0.4, 1]} // Controla dónde empieza el oscurecimiento (40% → 100%)
            style={styles.gradientOverlay}
          />

          <View style={styles.posterOverlay}>
            <Image
              source={{
                uri: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }}
              style={styles.poster}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.year}>{releaseYear} • {formatRuntime(movie.runtime)}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#ffd700" />
                <Text style={styles.rating}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </Text>
                <Text style={styles.voteCount}>
                  ({movie.vote_count} votos)
                </Text>
              </View>
              
              <View style={styles.genreContainer}>
                {genres.map((genre) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/*Sinopsis*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.overview}>
            {movie.overview || 'No hay sinopsis disponible para esta película.'}
          </Text>
        </View>

        {/* Reparto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reparto</Text>
          {cast.length > 0 ? (
            <FlatList
              data={cast}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.castItem}>
                  <Image
                    source={{
                      uri: item.profile_path
                        ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    style={styles.castImage}
                  />
                  <Text style={styles.castName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.castCharacter} numberOfLines={2}>{item.character}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No hay información del reparto disponible.</Text>
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Director:</Text>
            <Text style={styles.detailValue}>{director ? director.name : 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de estreno:</Text>
            <Text style={styles.detailValue}>
              {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Presupuesto:</Text>
            <Text style={styles.detailValue}>
              {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ingresos:</Text>
            <Text style={styles.detailValue}>
              {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Idioma original:</Text>
            <Text style={styles.detailValue}>
              {movie.original_language ? movie.original_language.toUpperCase() : 'N/A'}
            </Text>
          </View>
        </View>
        
        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Favorito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Guardar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

//Hay que colocar para que el usuario pueda guardar, dar me gusta o compartir qsy

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
  backButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterContainer: {
    position: 'relative',
    height: 300,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject, // Ocupa todo el espacio del contenedor padre
    justifyContent: 'flex-end', // Alinea el degradado en la parte inferior
  },
  backdrop: {
    width: '100%',
    height: 220,
  },
  posterOverlay: {
    flexDirection: 'row',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#ff6b6b',
    fontSize: 12,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ccc',
  },
  castItem: {
    width: 100,
    marginRight: 12,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  castCharacter: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  noDataText: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#aaa',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
});

export default MovieDetailScreen;