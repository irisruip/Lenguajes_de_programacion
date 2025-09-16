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

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
          searchQuery
        )}&page=1`
      );
      const data = await response.json();
      const filteredResults = data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      const sortedResults = filteredResults.sort(
        (a, b) => b.vote_average - a.vote_average
      );
      setSearchResults(sortedResults);
    } catch (error) {
      console.error("Error buscando contenido:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item) => {
    if (item.media_type === "movie") {
      navigate("MovieDetail", { movieId: item.id });
    } else if (item.media_type === "tv") {
      navigate("SeriesDetail", { seriesId: item.id });
    }
  };

  const renderItem = ({ item }) => {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : "N/A";

    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => handleItemPress(item)}
      >
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
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
          <Text style={styles.movieYear}>{year}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffd700" />
            <Text style={styles.rating}>
              {item.vote_average?.toFixed(1) || "N/A"}
            </Text>
          </View>
          {item.media_type === "tv" && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>SERIE</Text>
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
});

export default ExploreScreen;
