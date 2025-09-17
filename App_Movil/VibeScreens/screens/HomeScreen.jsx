import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMovies } from "../context/MovieContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_KEY } from "@env";

const apiKey = API_KEY || "";

// Componente para mostrar posters (películas o series)
const MoviePoster = ({ movie, onPress }) => (
  <TouchableOpacity style={styles.posterContainer} onPress={onPress}>
    <Image
      source={{
        uri: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(movie.title || movie.name || "No Image") +
            "&size=150&background=1a1a2e&color=fff",
      }}
      style={styles.poster}
    />
  </TouchableOpacity>
);

// Componente reutilizable para colecciones de películas/series
const MovieCollection = ({ title, movies = [], onMoviePress }) => {
  if (!movies || movies.length === 0) {
    return (
      <View style={styles.collectionContainer}>
        <Text style={styles.collectionTitle}>{title}</Text>
        <View style={styles.emptyCollection}>
          <Text style={styles.emptyText}>Cargando...</Text>
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
        renderItem={({ item }) => (
          <MoviePoster movie={item} onPress={() => onMoviePress(item)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

// Componente para mostrar cada reseña
const ReviewItem = ({ review, onPress }) => (
  <TouchableOpacity style={styles.reviewItemContainer} onPress={onPress}>
    <Image
      source={{
        uri: review.backdropPath
          ? `https://image.tmdb.org/t/p/w780${review.backdropPath}`
          : "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(review.contentTitle || "No Image") +
            "&background=1a1a2e&color=fff&size=300",
      }}
      style={styles.reviewBackdrop}
    />
    <View style={styles.reviewOverlay}>
      <View style={styles.reviewTopLeftTitle}>
        <Text style={styles.reviewTitle} numberOfLines={1}>
          {review.contentTitle}
        </Text>
      </View>
      <View style={styles.reviewTopRight}>
        <View style={styles.reviewRating}>
          <Ionicons name="star" size={12} color="#ffd700" />
          <Text style={styles.reviewRatingText}>{review.rating}/5</Text>
        </View>
      </View>
      <LinearGradient
        colors={[
          "transparent",
          "rgba(0, 0, 0, 0.3)",
          "rgba(0, 0, 0, 0.6)",
          "rgba(0, 0, 0, 0.8)",
        ]}
        style={styles.reviewGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.reviewBottomLeft}>
        <Text style={styles.reviewAuthor} numberOfLines={1}>
          {review.username}
        </Text>
        <Text style={styles.reviewContent} numberOfLines={2}>
          {review.text}
        </Text>
        <Text style={styles.reviewDate}>
          {review.createdAt?.toDate
            ? review.createdAt.toDate().toLocaleDateString("es-ES")
            : "Fecha desconocida"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Componente para la colección de reseñas
const ReviewCollection = ({
  title,
  reviews = [],
  loading = false,
  onReviewPress,
}) => {
  if (loading || !reviews) {
    return (
      <View style={styles.collectionContainer}>
        <Text style={styles.collectionTitle}>{title}</Text>
        <View style={styles.emptyCollection}>
          <ActivityIndicator size="small" color="#ff6b6b" />
          <Text style={styles.emptyText}>Cargando reseñas...</Text>
        </View>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.collectionContainer}>
        <Text style={styles.collectionTitle}>{title}</Text>
        <View style={styles.emptyCollection}>
          <Ionicons name="chatbubble-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>No hay reseñas aún</Text>
          <Text style={styles.emptySubtext}>
            Sé el primero en compartir tu opinión
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.collectionContainer}>
      <Text style={styles.collectionTitle}>{title}</Text>
      <FlatList
        data={reviews.slice(0, 5)} // Limitar a máximo 5 reseñas
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewItem
            review={item}
            onPress={() => onReviewPress && onReviewPress(item)}
          />
        )}
        contentContainerStyle={styles.reviewsContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    trendingMovies, // películas populares
    monthlyMovies, // películas del mes
    isLoading,
    error,
    refreshMovies,
    getFeaturedReviews,
  } = useMovies();

  const [refreshing, setRefreshing] = useState(false);
  const [series, setSeries] = useState([]);
  const [monthlySeries, setMonthlySeries] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState(null);

  // Estado para contenidos de Netflix y Disney (se han eliminado HBO y Amazon)
  const [netflixMovies, setNetflixMovies] = useState([]);
  const [disneyMovies, setDisneyMovies] = useState([]);
  const [netflixSeries, setNetflixSeries] = useState([]);
  const [disneySeries, setDisneySeries] = useState([]);

  // Estado para reseñas destacadas de Firestore
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsUnsubscribe, setReviewsUnsubscribe] = useState(null);

  // Calculamos "Las mejores películas" ordenando por vote_average descendente
  const bestMovies = trendingMovies
    ? [...trendingMovies]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 5)
    : [];

  // Calculamos "Las mejores series" ordenando la lista de series populares
  const bestSeries = series
    ? [...series].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5)
    : [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshMovies();
    await fetchSeries();
    await fetchMonthlySeries();
    // Actualizamos contenidos para cada plataforma
    await fetchPlatformMovies(8, setNetflixMovies);
    await fetchPlatformMovies(337, setDisneyMovies);
    await fetchPlatformSeries(8, setNetflixSeries);
    await fetchPlatformSeries(337, setDisneySeries);
    // Actualizamos reseñas destacadas de Firestore
    if (reviewsUnsubscribe) {
      reviewsUnsubscribe();
    }
    const newUnsubscribe = getFeaturedReviews((reviews) => {
      setFeaturedReviews(reviews);
      setReviewsLoading(false);
    });
    setReviewsUnsubscribe(() => newUnsubscribe);
    setRefreshing(false);
  }, [refreshMovies, trendingMovies]);

  const handleMoviePress = async (movie) => {
    const reviews = await fetchReviews(movie.id, "movie");
    navigation.navigate("MovieDetail", { movieId: movie.id, reviews });
  };

  const handleSeriesPress = async (serie) => {
    const reviews = await fetchReviews(serie.id, "tv");
    navigation.navigate("SeriesDetail", { seriesId: serie.id, reviews });
  };

  const handleReviewPress = (review) => {
    // Navegar a los detalles del contenido según el tipo
    if (review.type === "movie") {
      navigation.navigate("MovieDetail", { movieId: review.contentId });
    } else {
      navigation.navigate("SeriesDetail", { seriesId: review.contentId });
    }
  };

  // Obtener series populares usando la TMDb API
  const fetchSeries = async () => {
    setSeriesLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es-MX&page=1`
      );
      const data = await response.json();
      if (data.results) {
        setSeries(data.results);
      }
    } catch (err) {
      setSeriesError(err.message);
    } finally {
      setSeriesLoading(false);
    }
  };

  // Obtener series del mes
  const fetchMonthlySeries = async () => {
    setSeriesLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=es-MX&page=1`
      );
      const data = await response.json();
      if (data.results) {
        setMonthlySeries(data.results);
      }
    } catch (err) {
      setSeriesError(err.message);
    } finally {
      setSeriesLoading(false);
    }
  };

  // Función genérica para obtener películas según proveedor
  const fetchPlatformMovies = async (providerId, setter) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-MX&with_watch_providers=${providerId}&watch_region=MX&sort_by=popularity.desc&page=1`
      );
      const data = await response.json();
      if (data.results) {
        setter(data.results);
      }
    } catch (error) {
      console.error(
        `Error fetching platform movies (provider ${providerId}):`,
        error
      );
    }
  };

  // Función genérica para obtener series según proveedor
  const fetchPlatformSeries = async (providerId, setter) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-MX&with_watch_providers=${providerId}&watch_region=MX&sort_by=popularity.desc&page=1`
      );
      const data = await response.json();
      if (data.results) {
        setter(data.results);
      }
    } catch (error) {
      console.error(
        `Error fetching platform series (provider ${providerId}):`,
        error
      );
    }
  };

  // Obtener reseñas de la TMDb API
  const fetchReviews = async (id, type) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${API_KEY}&language=es-MX`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Llamadas iniciales
  useEffect(() => {
    fetchSeries();
    fetchMonthlySeries();
    // Cargar contenidos para cada plataforma
    fetchPlatformMovies(8, setNetflixMovies);
    fetchPlatformMovies(337, setDisneyMovies);
    fetchPlatformSeries(8, setNetflixSeries);
    fetchPlatformSeries(337, setDisneySeries);
    // Cargar reseñas destacadas de Firestore con listener en tiempo real
    const unsubscribe = getFeaturedReviews((reviews) => {
      setFeaturedReviews(reviews);
      setReviewsLoading(false);
    });
    setReviewsUnsubscribe(() => unsubscribe);
  }, [trendingMovies]);

  // Cleanup effect for reviews listener
  useEffect(() => {
    return () => {
      if (reviewsUnsubscribe) {
        reviewsUnsubscribe();
      }
    };
  }, [reviewsUnsubscribe]);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (error || seriesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error || seriesError}</Text>
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#ff6b6b"
        />
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

      {/* Sección de películas */}
      <MovieCollection
        title="Películas Populares"
        movies={trendingMovies ? trendingMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />
      <MovieCollection
        title="Películas del Mes"
        movies={monthlyMovies ? monthlyMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />
      <MovieCollection
        title="Las Mejores Películas"
        movies={bestMovies}
        onMoviePress={handleMoviePress}
      />

      {/* Sección de Reseñas Destacadas */}
      <ReviewCollection
        title="Reseñas Destacadas"
        reviews={featuredReviews}
        loading={reviewsLoading}
        onReviewPress={handleReviewPress}
      />

      {/* Sección de series */}
      {seriesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#ff6b6b" />
        </View>
      ) : seriesError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error cargando series: {seriesError}
          </Text>
        </View>
      ) : (
        <>
          <MovieCollection
            title="Series Populares"
            movies={series ? series.slice(0, 5) : []}
            onMoviePress={handleSeriesPress}
          />
          <MovieCollection
            title="Series del Mes"
            movies={monthlySeries ? monthlySeries.slice(0, 5) : []}
            onMoviePress={handleSeriesPress}
          />
          <MovieCollection
            title="Las Mejores Series"
            movies={bestSeries}
            onMoviePress={handleSeriesPress}
          />
        </>
      )}

      {/* Secciones para Netflix y Disney+ */}
      <MovieCollection
        title="Películas en Netflix"
        movies={netflixMovies ? netflixMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />
      <MovieCollection
        title="Series en Netflix"
        movies={netflixSeries ? netflixSeries.slice(0, 5) : []}
        onMoviePress={handleSeriesPress}
      />
      <MovieCollection
        title="Películas en Disney+"
        movies={disneyMovies ? disneyMovies.slice(0, 5) : []}
        onMoviePress={handleMoviePress}
      />
      <MovieCollection
        title="Series en Disney+"
        movies={disneySeries ? disneySeries.slice(0, 5) : []}
        onMoviePress={handleSeriesPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  username: {
    fontSize: 14,
    color: "#aaa",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  emptyCollection: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
  posterContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  reviewItemContainer: {
    borderRadius: 8,
    marginRight: 12,
    width: 300,
    height: 160,
    overflow: "hidden",
  },
  reviewBackdrop: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  reviewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
  },
  reviewTopLeftTitle: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 80, // Leave space for the right side content
    maxWidth: "60%",
  },
  reviewTopRight: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "flex-end",
  },
  reviewGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%", // Covers the bottom 60% of the card
  },
  reviewBottomLeft: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 80, // Leave space for the right side content
    maxWidth: "60%",
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    color: "#ffd700",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 3,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  reviewContent: {
    fontSize: 12,
    color: "#ccc",
    lineHeight: 16,
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 10,
    color: "#ff6b6b",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  reviewsContainer: {
    paddingHorizontal: 2,
  },
});

export default HomeScreen;
