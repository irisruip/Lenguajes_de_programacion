import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovies } from '../context/MovieContext';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SeriesDetailScreen = ({ route, navigation }) => {
  const { seriesId } = route.params;
  const { getSeriesDetails } = useMovies(); // Asegúrate de tener esta función en tu contexto
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        setLoading(true);
        const details = await getSeriesDetails(seriesId);
        setSeries(details);
      } catch (err) {
        console.error('Error fetching series details:', err);
        setError('No se pudieron cargar los detalles de la serie');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesDetails();
  }, [seriesId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Echa un vistazo a ${series.name} (${series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'}). ¡Te encantará!`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (error || !series) {
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

  // Calcular el año de primera emisión y formatear la duración promedio (si se dispone de esos datos)
  const firstAirYear = series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'N/A';
  const formatEpisodeRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const genres = series.genres || [];

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
      <ScrollView>
        {/* Imagen de fondo y poster */}
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: series.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
                : 'https://via.placeholder.com/1280x720?text=No+Image'
            }}
            style={styles.backdrop}
          />
          <View style={styles.posterOverlay}>
            <Image
              source={{
                uri: series.poster_path
                  ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }}
              style={styles.poster}
            />
            <View style={styles.seriesInfo}>
              <Text style={styles.title}>{series.name}</Text>
              <Text style={styles.year}>{firstAirYear} • {formatEpisodeRuntime(series.episode_run_time && series.episode_run_time[0])}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#ffd700" />
                <Text style={styles.rating}>
                  {series.vote_average ? series.vote_average.toFixed(1) : 'N/A'}
                </Text>
                <Text style={styles.voteCount}>
                  ({series.vote_count} votos)
                </Text>
              </View>
              <View style={styles.genreContainer}>
                {genres.map((genre) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
              {/* Botones de interacción */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={toggleSave}>
                  <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={24} color="#fff" />
                  <Text style={styles.actionText}>{saved ? 'Guardado' : 'Guardar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                  <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color="#ff6b6b" />
                  <Text style={styles.actionText}>{liked ? 'Me gusta' : 'Me gusta'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={24} color="#fff" />
                  <Text style={styles.actionText}>Compartir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* Sección de Sinopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.overview}>
            {series.overview || 'No hay sinopsis disponible para esta serie.'}
          </Text>
        </View>
      </ScrollView>
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
  backdrop: {
    width: '100%',
    height: 220,
  },
  posterOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 16,
    bottom: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  seriesInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  year: {
    fontSize: 14,
    color: '#ccc',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default SeriesDetailScreen;
