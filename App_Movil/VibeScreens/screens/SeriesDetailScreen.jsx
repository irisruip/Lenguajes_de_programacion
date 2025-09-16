import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSeries } from "../context/SeriesContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import { useMovies } from "../context/MovieContext";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const { width } = Dimensions.get("window");

const SeriesDetailScreen = ({ route, navigation }) => {
  const { seriesId } = route.params;
  const { getSeriesDetails } = useSeries();
  const {
    getUserLists,
    addMovieToList,
    removeItemFromList,
    isItemInAnyList,
    isItemInList,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useMovies();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [cast, setCast] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [listsUnsubscribe, setListsUnsubscribe] = useState(null);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        setLoading(true);
        const details = await getSeriesDetails(seriesId);
        setSeries(details);
        console.log("Series details:", details);

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
          const countryCode = "ES"; // Puedes cambiar esto según la región del usuario
          const providers = details["watch/providers"].results[countryCode];
          setWatchProviders(providers);
        }

        // Obtener el reparto
        if (details.credits && details.credits.cast) {
          setCast(details.credits.cast.slice(0, 10)); // Limitamos a 10 actores
        }

        // Check if series is saved
        const currentUser = auth.currentUser;
        if (currentUser) {
          const saved = await isItemInAnyList(currentUser.uid, seriesId, "tv");
          setIsSaved(saved);

          // Check if series is favorited
          const favorited = await isFavorite(currentUser.uid, seriesId, "tv");
          setIsFavorited(favorited);
        }
      } catch (err) {
        console.error("Error fetching series details:", err);
        setError("No se pudieron cargar los detalles de la serie");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesDetails();
  }, [seriesId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Echa un vistazo a ${series.name} (${
          series.first_air_date ? series.first_air_date.split("-")[0] : "N/A"
        }). ¡Te encantará!`,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const toggleLike = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && series) {
      try {
        if (isFavorited) {
          await removeFavorite(currentUser.uid, series.id, "tv");
          setIsFavorited(false);
        } else {
          await addFavorite(currentUser.uid, series);
          setIsFavorited(true);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        Alert.alert("Error", "No se pudo actualizar el favorito");
      }
    }
  };

  const toggleSave = async () => {
    if (showListModal) return; // Prevent opening multiple times
    // Fetch user lists and show modal
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = getUserLists(currentUser.uid, async (lists) => {
        setUserLists(lists);
        // Initialize selected lists
        const selected = new Set();
        for (const list of lists) {
          const isIn = await isItemInList(
            currentUser.uid,
            list.id,
            series.id,
            "tv"
          );
          if (isIn) selected.add(list.id);
        }
        setSelectedLists(selected);
      });
      setListsUnsubscribe(() => unsubscribe);
      setShowListModal(true);
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
    if (currentUser && series) {
      try {
        const promises = [];
        for (const list of userLists) {
          const isSelected = selectedLists.has(list.id);
          const isInList = await isItemInList(
            currentUser.uid,
            list.id,
            series.id,
            "tv"
          );
          if (isSelected && !isInList) {
            promises.push(addMovieToList(currentUser.uid, list.id, series));
          } else if (!isSelected && isInList) {
            promises.push(
              removeItemFromList(currentUser.uid, list.id, series.id, "tv")
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
        const saved = await isItemInAnyList(currentUser.uid, series.id, "tv");
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

  if (error || !series) {
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

  // Calcular el año de primera emisión y formatear la duración promedio
  const firstAirYear = series.first_air_date
    ? new Date(series.first_air_date).getFullYear()
    : "N/A";
  const formatEpisodeRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
        <ScrollView>
          {/* Imagen de fondo con gradiente */}
          <View style={styles.backdropContainer}>
            <Image
              source={{
                uri: series.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(series.name || "No Image") +
                    "&size=500&background=1a1a2e&color=fff",
              }}
              style={styles.backdrop}
            />
            <LinearGradient
              colors={["transparent", "rgba(26, 26, 46, 0.8)", "#1a1a2e"]}
              style={styles.gradientOverlay}
            />
          </View>

          {/* Información principal de la serie */}
          <View style={styles.mainInfoContainer}>
            <View style={styles.posterContainer}>
              <Image
                source={{
                  uri: series.poster_path
                    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                    : "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(series.name || "No Image") +
                      "&size=150&background=1a1a2e&color=fff",
                }}
                style={styles.poster}
              />
            </View>

            <View style={styles.seriesInfo}>
              <Text style={styles.title}>{series.name}</Text>
              <Text style={styles.year}>
                {firstAirYear} • {series.number_of_seasons || 0} temporadas •{" "}
                {formatEpisodeRuntime(
                  series.episode_run_time && series.episode_run_time[0]
                )}
              </Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#ffd700" />
                <Text style={styles.rating}>
                  {series.vote_average ? series.vote_average.toFixed(1) : "N/A"}
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

          {/* Sección de Sinopsis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.overview}>
              {series.overview || "No hay sinopsis disponible para esta serie."}
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

          {/* Sección de Reparto*/}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reparto Principal</Text>
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
            </View>
          )}

          {/* Información adicional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={styles.detailValue}>
                {series.status === "Returning Series"
                  ? "En emisión"
                  : series.status === "Ended"
                  ? "Finalizada"
                  : series.status === "Canceled"
                  ? "Cancelada"
                  : series.status}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Primer episodio:</Text>
              <Text style={styles.detailValue}>
                {series.first_air_date
                  ? new Date(series.first_air_date).toLocaleDateString("es-ES")
                  : "Desconocido"}
              </Text>
            </View>

            {series.last_air_date && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Último episodio:</Text>
                <Text style={styles.detailValue}>
                  {new Date(series.last_air_date).toLocaleDateString("es-ES")}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Temporadas:</Text>
              <Text style={styles.detailValue}>
                {series.number_of_seasons || 0}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Episodios:</Text>
              <Text style={styles.detailValue}>
                {series.number_of_episodes || 0}
              </Text>
            </View>

            {series.networks && series.networks.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cadena:</Text>
                <Text style={styles.detailValue}>
                  {series.networks.map((network) => network.name).join(", ")}
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
  seriesInfo: {
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
  closeModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeModalText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
});

export default SeriesDetailScreen;
