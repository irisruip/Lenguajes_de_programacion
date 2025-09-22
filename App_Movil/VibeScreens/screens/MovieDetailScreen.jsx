import { useEffect, useState, useRef } from "react";
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
  Linking,
  Share,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMovies } from "../context/MovieContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";
import { API_KEY } from "@env";

// Import external link images
const imdbLogo = require("../assets/imdb.webp");
const twitterLogo = require("../assets/twitter.webp");

const auth = getAuth(appFirebase);

const { width } = Dimensions.get("window");

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const {
    getMovieDetails,
    getUserLists,
    addMovieToList,
    removeItemFromList,
    isItemInAnyList,
    isItemInList,
    addFavorite,
    removeFavorite,
    isFavorite,
    getReviewsForContent,
  } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [listsUnsubscribe, setListsUnsubscribe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsUnsubscribe, setReviewsUnsubscribe] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [externalIds, setExternalIds] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovie(details);

        // Obtener el trailer
        if (details.videos && details.videos.results) {
          const trailer = details.videos.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) setTrailerKey(trailer.key);
        }

        // Obtener proveedores de streaming
        if (details["watch/providers"] && details["watch/providers"].results) {
          // Usar el país del usuario (aquí usamos ES para España como ejemplo)
          const countryCode = "MX"; //Se puede cambiar esto según la región
          const providers = details["watch/providers"].results[countryCode];
          setWatchProviders(providers);
        }

        // Obtener certificación
        try {
          const releaseResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${API_KEY}`
          );
          if (releaseResponse.ok) {
            const releaseData = await releaseResponse.json();
            const mxRelease =
              releaseData.results.find((r) => r.iso_3166_1 === "MX") ||
              releaseData.results.find((r) => r.iso_3166_1 === "US");
            if (mxRelease && mxRelease.release_dates.length > 0) {
              const certification = mxRelease.release_dates[0].certification;
              setMovie((prev) => ({ ...prev, certification }));
            }
          }
        } catch (error) {
          console.warn("Error fetching movie certification:", error);
        }

        // Obtener películas similares
        try {
          const similarResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=es-MX&page=1`
          );
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            if (similarData.results) {
              setSimilarMovies(similarData.results.slice(0, 10)); // Limitar a 10 películas similares
            }
          }
        } catch (error) {
          console.warn("Error fetching similar movies:", error);
        }

        // Obtener IDs externos
        try {
          const externalResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${API_KEY}`
          );
          if (externalResponse.ok) {
            const externalData = await externalResponse.json();
            setExternalIds(externalData);
          }
        } catch (error) {
          console.warn("Error fetching external IDs:", error);
        }

        // Check if movie is saved
        const currentUser = auth.currentUser;
        if (currentUser) {
          const saved = await isItemInAnyList(
            currentUser.uid,
            movieId,
            "movie"
          );
          setIsSaved(saved);

          // Check if movie is favorited
          const favorited = await isFavorite(currentUser.uid, movieId, "movie");
          setIsFavorited(favorited);

          // Load reviews
          const reviewsUnsub = getReviewsForContent(
            movieId,
            "movie",
            (movieReviews) => {
              setReviews(movieReviews);
            }
          );
          setReviewsUnsubscribe(() => reviewsUnsub);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("No se pudieron cargar los detalles de la película");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Handle scrolling to reviews section and refreshing reviews when coming back from review screen
  useEffect(() => {
    // Handle both direct parameters and nested parameters from tab navigation
    const params = route.params?.params || route.params;
    const scrollToReviews = params?.scrollToReviews;
    const refreshReviews = params?.refreshReviews;

    if (scrollToReviews && scrollViewRef.current) {
      // Force refresh reviews if refreshReviews parameter is present
      if (refreshReviews) {
        // Unsubscribe from current reviews listener
        if (reviewsUnsubscribe) {
          reviewsUnsubscribe();
        }
        // Re-subscribe to get fresh data
        const currentUser = auth.currentUser;
        if (currentUser) {
          const newReviewsUnsub = getReviewsForContent(
            movieId,
            "movie",
            (movieReviews) => {
              setReviews(movieReviews);
            }
          );
          setReviewsUnsubscribe(() => newReviewsUnsub);
        }
      }

      // Wait a bit for the content to load, then scroll to reviews section
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 800, animated: true }); // Approximate position of reviews section
      }, 500);
    }
  }, [route.params]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Echa un vistazo a ${movie.title} (${
          movie.release_date ? movie.release_date.split("-")[0] : "N/A"
        }). ¡Te encantará!`,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const toggleLike = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && movie) {
      try {
        if (isFavorited) {
          await removeFavorite(currentUser.uid, movie.id, "movie");
          setIsFavorited(false);
        } else {
          await addFavorite(currentUser.uid, movie);
          setIsFavorited(true);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        Alert.alert("Error", "No se pudo actualizar el favorito");
      }
    }
  };

  const toggleSave = async () => {
    console.log("toggleSave called");
    if (showListModal) return; // Prevent opening multiple times
    // Fetch user lists and show modal
    const currentUser = auth.currentUser;
    console.log("Current user:", currentUser);
    if (currentUser) {
      const unsubscribe = getUserLists(currentUser.uid, async (lists) => {
        console.log("User lists:", lists);
        setUserLists(lists);
        // Initialize selected lists
        const selected = new Set();
        for (const list of lists) {
          const isIn = await isItemInList(
            currentUser.uid,
            list.id,
            movie.id,
            "movie"
          );
          if (isIn) selected.add(list.id);
        }
        setSelectedLists(selected);
      });
      setListsUnsubscribe(() => unsubscribe);
      setShowListModal(true);
    } else {
      console.log("No current user");
    }
  };

  const handleListToggle = (listId) => {
    setSelectedLists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  const handleDone = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && movie) {
      try {
        const promises = [];
        for (const list of userLists) {
          const isSelected = selectedLists.has(list.id);
          const isInList = await isItemInList(
            currentUser.uid,
            list.id,
            movie.id,
            "movie"
          );
          if (isSelected && !isInList) {
            promises.push(addMovieToList(currentUser.uid, list.id, movie));
          } else if (!isSelected && isInList) {
            promises.push(
              removeItemFromList(currentUser.uid, list.id, movie.id, "movie")
            );
          }
        }
        await Promise.all(promises);
        if (listsUnsubscribe) {
          listsUnsubscribe();
          setListsUnsubscribe(null);
        }
        setShowListModal(false);
        // Update isSaved
        const saved = await isItemInAnyList(currentUser.uid, movie.id, "movie");
        setIsSaved(saved);
        console.log("Lists updated successfully");
      } catch (error) {
        console.error("Error updating lists:", error);
        Alert.alert("Error", "No se pudieron actualizar las listas");
      }
    }
  };

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
        <Text style={styles.errorText}>
          {error || "Ocurrió un error inesperado"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calcular el año de lanzamiento y formatear la duración
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const genres = movie.genres || [];

  // Obtener el director
  const director = movie.credits?.crew?.find(
    (person) => person.job === "Director"
  );

  //Obtener el reparto
  const cast = movie.credits?.cast || [];

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUsername}>{item.username}</Text>
        <View style={styles.reviewRating}>
          <Ionicons name="star" size={14} color="#ffd700" />
          <Text style={styles.reviewRatingText}>{item.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <Text style={styles.reviewDate}>
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleDateString("es-ES")
          : "Fecha desconocida"}
      </Text>
    </View>
  );

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
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => {
              console.log("Bookmark pressed");
              toggleSave();
            }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? "#ff6b6b" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={toggleLike}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? "#ff6b6b" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() =>
              navigation.navigate("Review", {
                contentId: movieId,
                contentTitle: movie?.title,
                contentType: "movie",
                posterPath: movie?.poster_path,
              })
            }
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
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
            source={{
              uri: `https://www.youtube.com/embed/${trailerKey}?rel=0&autoplay=1`,
            }}
            style={styles.webview}
            allowsFullscreenVideo
          />
        </View>
      ) : (
        <ScrollView ref={scrollViewRef}>
          {/* Background con gradiente */}
          <View style={styles.backdropContainer}>
            <Image
              source={{
                uri: movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(movie.title || "No Image") +
                    "&size=500&background=1a1a2e&color=fff",
              }}
              style={styles.backdrop}
            />
            <LinearGradient
              colors={["transparent", "rgba(26, 26, 46, 0.8)", "#1a1a2e"]}
              style={styles.gradientOverlay}
            />
          </View>

          {/* Información principal de la película */}
          <View style={styles.mainInfoContainer}>
            <View style={styles.posterContainer}>
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(movie.title || "No Image") +
                      "&size=150&background=1a1a2e&color=fff",
                }}
                style={styles.poster}
              />
            </View>

            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.year}>
                {releaseYear} • {formatRuntime(movie.runtime)}
              </Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#ffd700" />
                <Text style={styles.rating}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </Text>
                <Text style={styles.voteCount}>({movie.vote_count} votos)</Text>
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
              {movie.overview ||
                "No hay sinopsis disponible para esta película."}
            </Text>
          </View>

          {/* Plataformas de streaming */}
          {watchProviders && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dónde ver</Text>

              {watchProviders.flatrate &&
                watchProviders.flatrate.length > 0 && (
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
                              uri: `https://image.tmdb.org/t/p/original${item.logo_path}`,
                            }}
                            style={styles.providerLogo}
                          />
                          <Text style={styles.providerName} numberOfLines={1}>
                            {item.provider_name}
                          </Text>
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
                            uri: `https://image.tmdb.org/t/p/original${item.logo_path}`,
                          }}
                          style={styles.providerLogo}
                        />
                        <Text style={styles.providerName} numberOfLines={1}>
                          {item.provider_name}
                        </Text>
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
                            uri: `https://image.tmdb.org/t/p/original${item.logo_path}`,
                          }}
                          style={styles.providerLogo}
                        />
                        <Text style={styles.providerName} numberOfLines={1}>
                          {item.provider_name}
                        </Text>
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
                  <Text style={styles.justWatchButtonText}>
                    Ver todas las opciones
                  </Text>
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
                          : "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(item.name) +
                            "&size=150&background=1a1a2e&color=fff",
                      }}
                      style={styles.castImage}
                    />
                    <Text style={styles.castName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.castCharacter} numberOfLines={2}>
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noDataText}>
                No hay información del reparto disponible.
              </Text>
            )}
          </View>

          {/* Películas Similares */}
          {similarMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Películas Similares</Text>
              <FlatList
                data={similarMovies}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.similarItem}
                    onPress={() =>
                      navigation.push("MovieDetail", { movieId: item.id })
                    }
                  >
                    <Image
                      source={{
                        uri: item.poster_path
                          ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                          : "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(item.title || "No Image") +
                            "&size=150&background=1a1a2e&color=fff",
                      }}
                      style={styles.similarImage}
                    />
                    <Text style={styles.similarTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Información adicional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Director:</Text>
              <Text style={styles.detailValue}>
                {director ? director.name : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de estreno:</Text>
              <Text style={styles.detailValue}>
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Presupuesto:</Text>
              <Text style={styles.detailValue}>
                {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ingresos:</Text>
              <Text style={styles.detailValue}>
                {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Certificación:</Text>
              <Text style={styles.detailValue}>
                {movie.certification || "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Idioma original:</Text>
              <Text style={styles.detailValue}>
                {movie.original_language
                  ? movie.original_language.toUpperCase()
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* IDs Externos */}
          {externalIds && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Enlaces Externos</Text>
              <View style={styles.externalLinksContainer}>
                {externalIds.imdb_id && (
                  <TouchableOpacity
                    style={styles.externalLink}
                    onPress={() =>
                      Linking.openURL(
                        `https://www.imdb.com/title/${externalIds.imdb_id}`
                      )
                    }
                  >
                    <Image source={imdbLogo} style={styles.externalLinkImage} />
                    <Text style={styles.externalLinkText}>IMDb</Text>
                  </TouchableOpacity>
                )}
                {externalIds.facebook_id && (
                  <TouchableOpacity
                    style={styles.externalLink}
                    onPress={() =>
                      Linking.openURL(
                        `https://www.facebook.com/${externalIds.facebook_id}`
                      )
                    }
                  >
                    <Ionicons name="logo-facebook" size={24} color="#1877f2" />
                    <Text style={styles.externalLinkText}>Facebook</Text>
                  </TouchableOpacity>
                )}
                {externalIds.instagram_id && (
                  <TouchableOpacity
                    style={styles.externalLink}
                    onPress={() =>
                      Linking.openURL(
                        `https://www.instagram.com/${externalIds.instagram_id}`
                      )
                    }
                  >
                    <Ionicons name="logo-instagram" size={24} color="#e4405f" />
                    <Text style={styles.externalLinkText}>Instagram</Text>
                  </TouchableOpacity>
                )}
                {externalIds.twitter_id && (
                  <TouchableOpacity
                    style={styles.externalLink}
                    onPress={() =>
                      Linking.openURL(
                        `https://twitter.com/${externalIds.twitter_id}`
                      )
                    }
                  >
                    <Image
                      source={twitterLogo}
                      style={styles.externalLinkImage}
                    />
                    <Text style={styles.externalLinkText}>Twitter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Reseñas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Reseñas ({reviews.length})
              </Text>
              <TouchableOpacity
                style={styles.writeReviewButton}
                onPress={() =>
                  navigation.navigate("Review", {
                    contentId: movieId,
                    contentTitle: movie?.title,
                    contentType: "movie",
                    posterPath: movie?.poster_path,
                  })
                }
              >
                <Ionicons name="create-outline" size={16} color="#ff6b6b" />
                <Text style={styles.writeReviewText}>Escribir reseña</Text>
              </TouchableOpacity>
            </View>

            {reviews.length > 0 ? (
              <View>
                <FlatList
                  data={reviews.slice(0, 3)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderReviewItem}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
                {reviews.length > 3 && (
                  <TouchableOpacity
                    style={styles.viewAllReviewsButton}
                    onPress={() =>
                      navigation.navigate("AllReviews", {
                        contentId: movieId,
                        contentTitle: movie.title,
                        contentType: "movie",
                        posterPath: movie.poster_path,
                      })
                    }
                  >
                    <Text style={styles.viewAllReviewsText}>
                      Ver todas las reseñas ({reviews.length})
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#ff6b6b"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.noReviewsContainer}>
                <Ionicons name="chatbubble-outline" size={48} color="#666" />
                <Text style={styles.noReviewsText}>No hay reseñas aún</Text>
                <Text style={styles.noReviewsSubtext}>
                  Sé el primero en compartir tu opinión
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal for selecting list */}
      <Modal
        visible={showListModal}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => {
          if (listsUnsubscribe) {
            listsUnsubscribe();
            setListsUnsubscribe(null);
          }
          setShowListModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar a una lista</Text>
            <TouchableOpacity
              style={styles.createListButton}
              onPress={() => {
                setShowListModal(false);
                navigation.navigate("Perfil", { screen: "CreateList" });
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#ff6b6b" />
              <Text style={styles.createListText}>Crear nueva lista</Text>
            </TouchableOpacity>
            <FlatList
              data={userLists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleListToggle(item.id)}
                >
                  <Text style={styles.listName}>{item.name}</Text>
                  <Ionicons
                    name={
                      selectedLists.has(item.id)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={selectedLists.has(item.id) ? "#ff6b6b" : "#aaa"}
                  />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  backButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  backdropContainer: {
    position: "relative",
    height: 250,
  },
  backdrop: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 250,
    zIndex: 1,
  },
  mainInfoContainer: {
    flexDirection: "row",
    padding: 16,
    marginTop: -60,
    zIndex: 2,
  },
  posterContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffd700",
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: "#ccc",
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#ff6b6b",
    fontSize: 12,
  },
  trailerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b6b",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  trailerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  trailerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  closeTrailerButton: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
    color: "#ccc",
  },
  providersSection: {
    marginBottom: 16,
  },
  providerTitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 8,
  },
  providerItem: {
    width: 80,
    marginRight: 12,
    alignItems: "center",
  },
  providerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
  justWatchButton: {
    backgroundColor: "#4a4a6a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  justWatchButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  castCharacter: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
  noDataText: {
    color: "#ccc",
    fontStyle: "italic",
  },
  similarItem: {
    width: 120,
    marginRight: 12,
    alignItems: "center",
  },
  similarImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarTitle: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  externalLinksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  externalLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  externalLinkText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  externalLinkImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: "#aaa",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  createListButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 10,
  },
  createListText: {
    fontSize: 16,
    color: "#ff6b6b",
    marginLeft: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  listName: {
    fontSize: 16,
    color: "#fff",
  },
  doneButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  writeReviewButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  writeReviewText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  noReviewsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
  viewAllReviewsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  viewAllReviewsText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default MovieDetailScreen;
