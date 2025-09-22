import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMovies } from "../context/MovieContext";
import { API_KEY } from "@env";

const ExploreScreen = ({ navigation }) => {
  const { searchMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "multi", // 'movie', 'tv', 'multi', 'person'
    year: "",
    rating: "",
    genre: "",
    provider: "",
    sortBy: "popularity.desc",
  });

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        // Para personas sin búsqueda, no hay discover, mostrar resultados vacíos
        if (filters.type === "person") {
          setSearchResults([]);
        } else {
          // Para películas/series, verificar si hay filtros activos
          const hasActiveFilters =
            filters.year ||
            filters.rating ||
            filters.genre ||
            filters.provider ||
            filters.type !== "multi";
          if (hasActiveFilters) {
            handleDiscover();
          } else {
            setSearchResults([]);
          }
        }
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, filters]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      let endpoint = "multi";
      let filterFunction = (item) =>
        item.media_type === "movie" || item.media_type === "tv";

      // Determinar endpoint y filtro basado en el tipo seleccionado
      if (filters.type === "movie") {
        endpoint = "movie";
        filterFunction = (item) => item.media_type === "movie";
      } else if (filters.type === "tv") {
        endpoint = "tv";
        filterFunction = (item) => item.media_type === "tv";
      } else if (filters.type === "person") {
        endpoint = "person";
        filterFunction = (item) => item.media_type === "person";
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/search/${endpoint}?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
          searchQuery
        )}&page=1`
      );
      const data = await response.json();

      let filteredResults = [];
      if (endpoint === "multi") {
        filteredResults = data.results.filter(filterFunction);
      } else {
        // Para búsquedas específicas, agregar media_type
        filteredResults = data.results.map((item) => ({
          ...item,
          media_type: endpoint === "person" ? "person" : endpoint,
        }));
      }

      const sortedResults = filteredResults.sort((a, b) => {
        if (endpoint === "person") {
          // Para personas, ordenar por popularidad
          return (b.popularity || 0) - (a.popularity || 0);
        }
        return (b.vote_average || 0) - (a.vote_average || 0);
      });

      setSearchResults(sortedResults);
    } catch (error) {
      console.error("Error buscando contenido:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async () => {
    setLoading(true);
    try {
      // Para personas, no podemos usar discover, debemos usar search con filtros limitados
      if (filters.type === "person") {
        // Para personas, usamos búsqueda con filtros básicos
        const searchParams = `api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(
          searchQuery || ""
        )}&page=1`;
        const response = await fetch(
          `https://api.themoviedb.org/3/search/person?${searchParams}`
        );
        const data = await response.json();

        if (data.results) {
          const resultsWithType = data.results.map((item) => ({
            ...item,
            media_type: "person",
          }));
          setSearchResults(resultsWithType);
        }
      } else {
        // Para películas y series, usamos discover
        let endpoint = "multi";
        let params = `api_key=${API_KEY}&language=es-MX&page=1&sort_by=${filters.sortBy}`;

        // Determinar endpoint basado en el tipo
        if (filters.type === "movie") {
          endpoint = "movie";
        } else if (filters.type === "tv") {
          endpoint = "tv";
        }

        // Agregar filtros
        if (filters.year) {
          if (endpoint === "movie") {
            params += `&primary_release_year=${filters.year}`;
          } else if (endpoint === "tv") {
            params += `&first_air_date_year=${filters.year}`;
          }
        }

        if (filters.rating) {
          params += `&vote_average.gte=${filters.rating}`;
        }

        if (filters.genre) {
          params += `&with_genres=${filters.genre}`;
        }

        if (filters.provider) {
          params += `&with_watch_providers=${filters.provider}&watch_region=MX`;
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/${endpoint}?${params}`
        );
        const data = await response.json();

        if (data.results) {
          // Agregar media_type si no existe (para consistencia con search)
          const resultsWithType = data.results.map((item) => ({
            ...item,
            media_type:
              endpoint === "movie"
                ? "movie"
                : endpoint === "tv"
                ? "tv"
                : item.media_type,
          }));
          setSearchResults(resultsWithType);
        }
      }
    } catch (error) {
      console.error("Error discovering content:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item) => {
    if (item.media_type === "movie") {
      navigate("MovieDetail", { movieId: item.id });
    } else if (item.media_type === "tv") {
      navigate("SeriesDetail", { seriesId: item.id });
    } else if (item.media_type === "person") {
      navigate("PersonDetail", { personId: item.id });
    }
  };

  const renderItem = ({ item }) => {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : "N/A";

    // Para personas, usar profile_path en lugar de poster_path
    const imagePath =
      item.media_type === "person" ? item.profile_path : item.poster_path;

    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => handleItemPress(item)}
      >
        <Image
          source={{
            uri: imagePath
              ? `https://image.tmdb.org/t/p/w500${imagePath}`
              : "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(title) +
                "&size=150&background=1a1a2e&color=fff",
          }}
          style={styles.moviePoster}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {title}
          </Text>
          {item.media_type === "person" ? (
            <Text style={styles.movieYear}>
              {item.known_for_department || "Actor/Actriz"}
            </Text>
          ) : (
            <Text style={styles.movieYear}>{year}</Text>
          )}
          {item.media_type !== "person" && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffd700" />
              <Text style={styles.rating}>
                {item.vote_average?.toFixed(1) || "N/A"}
              </Text>
            </View>
          )}
          {item.media_type === "tv" && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>SERIE</Text>
            </View>
          )}
          {item.media_type === "person" && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>PERSONA</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar películas y series..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.moviesList}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#555" />
                <Text style={styles.emptyText}>
                  No se encontraron resultados para "{searchQuery}"
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="film-outline" size={64} color="#555" />
                <Text style={styles.emptyText}>
                  Busca tus películas y series favoritas
                </Text>
              </View>
            )
          }
        />
      )}

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filtros</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Tipo de contenido */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tipo de contenido</Text>
                <View style={styles.filterOptions}>
                  {[
                    { label: "Todo", value: "multi" },
                    { label: "Películas", value: "movie" },
                    { label: "Series", value: "tv" },
                    { label: "Actores", value: "person" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        filters.type === option.value &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, type: option.value }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.type === option.value &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Año */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Año</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Ej: 2023"
                  placeholderTextColor="#aaa"
                  value={filters.year}
                  onChangeText={(text) =>
                    setFilters((prev) => ({ ...prev, year: text }))
                  }
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              {/* Calificación mínima */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  Calificación mínima
                </Text>
                <View style={styles.ratingOptions}>
                  {[
                    { label: "Todas", value: "" },
                    { label: "7+", value: "7" },
                    { label: "8+", value: "8" },
                    { label: "9+", value: "9" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.ratingOption,
                        filters.rating === option.value &&
                          styles.ratingOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          rating: option.value,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.ratingOptionText,
                          filters.rating === option.value &&
                            styles.ratingOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Género */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Género</Text>
                <View style={styles.genreOptions}>
                  {[
                    { label: "Todos", value: "" },
                    { label: "Acción", value: "28" },
                    { label: "Comedia", value: "35" },
                    { label: "Drama", value: "18" },
                    { label: "Terror", value: "27" },
                    { label: "Ciencia Ficción", value: "878" },
                    { label: "Romance", value: "10749" },
                    { label: "Documental", value: "99" },
                  ].map((genre) => (
                    <TouchableOpacity
                      key={genre.value}
                      style={[
                        styles.genreOption,
                        filters.genre === genre.value &&
                          styles.genreOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, genre: genre.value }))
                      }
                    >
                      <Text
                        style={[
                          styles.genreOptionText,
                          filters.genre === genre.value &&
                            styles.genreOptionTextActive,
                        ]}
                      >
                        {genre.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Proveedor de Streaming */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  Plataforma de Streaming
                </Text>
                <View style={styles.providerOptions}>
                  {[
                    { label: "Todas", value: "" },
                    { label: "Netflix", value: "8" },
                    { label: "Disney+", value: "337" },
                    { label: "Amazon Prime", value: "119" },
                    { label: "HBO Max", value: "384" },
                    { label: "Apple TV+", value: "350" },
                    { label: "Paramount+", value: "531" },
                    { label: "Crunchyroll", value: "283" },
                  ].map((provider) => (
                    <TouchableOpacity
                      key={provider.value}
                      style={[
                        styles.providerOption,
                        filters.provider === provider.value &&
                          styles.providerOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          provider: provider.value,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.providerOptionText,
                          filters.provider === provider.value &&
                            styles.providerOptionTextActive,
                        ]}
                      >
                        {provider.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ordenar por */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                <View style={styles.sortOptions}>
                  {[
                    { label: "Popularidad", value: "popularity.desc" },
                    { label: "Calificación", value: "vote_average.desc" },
                    { label: "Fecha de estreno", value: "release_date.desc" },
                    { label: "Título A-Z", value: "title.asc" },
                  ].map((sort) => (
                    <TouchableOpacity
                      key={sort.value}
                      style={[
                        styles.sortOption,
                        filters.sortBy === sort.value &&
                          styles.sortOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, sortBy: sort.value }))
                      }
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          filters.sortBy === sort.value &&
                            styles.sortOptionTextActive,
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setFilters({
                    type: "multi",
                    year: "",
                    rating: "",
                    genre: "",
                    provider: "",
                    sortBy: "popularity.desc",
                  });
                  setSearchResults([]);
                }}
              >
                <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => {
                  setShowFilters(false);
                  if (searchQuery.trim()) {
                    handleSearch();
                  } else {
                    handleDiscover();
                  }
                }}
              >
                <Text style={styles.applyFiltersText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2a2a4a",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moviesList: {
    padding: 16,
  },
  movieItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    overflow: "hidden",
  },
  moviePoster: {
    width: 80,
    height: 120,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffd700",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff6b6b",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    position: "relative",
  },
  filterButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModal: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    backgroundColor: "#2a2a4a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: "#ff6b6b",
  },
  filterOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  filterOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterInput: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  ratingOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ratingOption: {
    backgroundColor: "#2a2a4a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  ratingOptionActive: {
    backgroundColor: "#ff6b6b",
  },
  ratingOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  ratingOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  genreOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreOption: {
    backgroundColor: "#2a2a4a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreOptionActive: {
    backgroundColor: "#ff6b6b",
  },
  genreOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  genreOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  providerOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  providerOption: {
    backgroundColor: "#2a2a4a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  providerOptionActive: {
    backgroundColor: "#ff6b6b",
  },
  providerOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  providerOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  sortOptions: {
    flexDirection: "column",
  },
  sortOption: {
    backgroundColor: "#2a2a4a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: "#ff6b6b",
  },
  sortOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  sortOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  clearFiltersButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  clearFiltersText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyFiltersButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyFiltersText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExploreScreen;
