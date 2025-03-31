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
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovies } from '../context/MovieContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { getMovieDetails } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovie(details);
        
        // Obtener el trailer
        if (details.videos && details.videos.results) {
          const trailer = details.videos.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          );
          if (trailer) setTrailerKey(trailer.key);
        }
        
        // Obtener proveedores de streaming
        if (details['watch/providers'] && details['watch/providers'].results) {
          // Usar el país del usuario (aquí usamos ES para España como ejemplo)
          const countryCode = 'ES'; // Puedes cambiar esto según la región del usuario
          const providers = details['watch/providers'].results[countryCode];
          setWatchProviders(providers);
        }
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
      
      {/* Botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {showTrailer && trailerKey ? (
        <View style={styles.trailerContainer}>
          <TouchableOpacity 
            style={styles.closeTrailerButton}
            onPress={() => setShowTrailer(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${trailerKey}?rel=0&autoplay=1` }}
            style={styles.webview}
            allowsFullscreenVideo
          />
        </View>
      ) : (
        <ScrollView>
          {/* Background con gradiente */}
          <View style={styles.posterContainer}>
            <Image
              source={{
                uri: movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                  : 'https://placehold.co/1280x720/1a1a2e/ffffff?text=No+Image'
              }}
              style={styles.backdrop}
            />
            <LinearGradient
              colors={['transparent', '#1a1a2e']}
              style={styles.gradientOverlay}
            />
            <View style={styles.posterOverlay}>
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://placehold.co/500x750/1a1a2e/ffffff?text=No+Image'
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
          
          {/* Botón de trailer */}
          {trailerKey && (
            <TouchableOpacity 
              style={styles.trailerButton}
              onPress={() => setShowTrailer(true)}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <Text style={styles.trailerButtonText}>Ver Trailer</Text>
            </TouchableOpacity>
          )}
          
          {/* Sinopsis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.overview}>
              {movie.overview || 'No hay sinopsis disponible para esta película.'}
            </Text>
          </View>

          {/* Plataformas de streaming */}
          {watchProviders && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dónde ver</Text>
              
              {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                <View style={styles.providersSection}>
                  <Text style={styles.providerTitle}>Streaming</Text>
                  <FlatList
                    data={watchProviders.flatrate}
                    keyExtractor={(item) => item.provider_id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.providerItem}>
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/original${item.logo_path}`
                          }}
                          style={styles.providerLogo}
                        />
                        <Text style={styles.providerName} numberOfLines={1}>{item.provider_name}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
              
              {watchProviders.rent && watchProviders.rent.length > 0 && (
                <View style={styles.providersSection}>
                  <Text style={styles.providerTitle}>Alquiler</Text>
                  <FlatList
                    data={watchProviders.rent}
                    keyExtractor={(item) => item.provider_id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.providerItem}>
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/original${item.logo_path}`
                          }}
                          style={styles.providerLogo}
                        />
                        <Text style={styles.providerName} numberOfLines={1}>{item.provider_name}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
              
              {watchProviders.buy && watchProviders.buy.length > 0 && (
                <View style={styles.providersSection}>
                  <Text style={styles.providerTitle}>Compra</Text>
                  <FlatList
                    data={watchProviders.buy}
                    keyExtractor={(item) => item.provider_id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.providerItem}>
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/original${item.logo_path}`
                          }}
                          style={styles.providerLogo}
                        />
                        <Text style={styles.providerName} numberOfLines={1}>{item.provider_name}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
              
              {watchProviders.link && (
                <TouchableOpacity 
                  style={styles.justWatchButton}
                  onPress={() => Linking.openURL(watchProviders.link)}
                >
                  <Text style={styles.justWatchButtonText}>Ver todas las opciones</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Reparto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reparto</Text>
            {cast && cast.length > 0 ? (
              <FlatList
                data={cast.slice(0, 10)} // Limitamos a 10 actores
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.castItem}>
                    <Image
                      source={{
                        uri: item.profile_path
                          ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
                          : 'https://placehold.co/200x300/1a1a2e/ffffff?text=No+Image'
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
    top: 40,
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
  backdrop: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 220,
    zIndex: 1,
  },
  posterOverlay: {
    flexDirection: 'row',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
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
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  trailerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trailerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  closeTrailerButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  providersSection: {
    marginBottom: 16,
  },
  providerTitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
  },
  providerItem: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
  },
  providerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  justWatchButton: {
    backgroundColor: '#4a4a6a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  justWatchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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