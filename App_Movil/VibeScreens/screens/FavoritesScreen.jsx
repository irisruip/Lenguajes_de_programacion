import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMovies } from "../context/MovieContext";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { getUserFavorites, removeFavorite } = useMovies();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesUnsubscribe, setFavoritesUnsubscribe] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = getUserFavorites(currentUser.uid, (userFavorites) => {
        setFavorites(userFavorites);
        setLoading(false);
      });
      setFavoritesUnsubscribe(() => unsubscribe);
    }

    return () => {
      if (favoritesUnsubscribe) {
        favoritesUnsubscribe();
      }
    };
  }, []);

  const handleFavoritePress = (favorite) => {
    // Navigate to movie or series detail
    if (favorite.type === "tv") {
      navigation.navigate("Inicio", {
        screen: "SeriesDetail",
        params: { seriesId: favorite.contentId },
      });
    } else {
      navigation.navigate("Inicio", {
        screen: "MovieDetail",
        params: { movieId: favorite.contentId },
      });
    }
  };

  const handleRemoveFavorite = async (favorite) => {
    Alert.alert(
      "Quitar de favoritos",
      `¿Quieres quitar "${favorite.title}" de tus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Quitar",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                await removeFavorite(
                  currentUser.uid,
                  favorite.contentId,
                  favorite.type
                );
              }
            } catch (error) {
              console.error("Error removing favorite:", error);
              Alert.alert("Error", "No se pudo quitar el favorito");
            }
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleFavoritePress(item)}
      onLongPress={() => handleRemoveFavorite(item)}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(item.title) +
              "&background=1a1a2e&color=fff&size=150",
        }}
        style={styles.favoritePoster}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
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
        <Text style={styles.headerTitle}>
          Mis Favoritos ({favorites.length})
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#555" />
          <Text style={styles.emptyTitle}>No tienes favoritos</Text>
          <Text style={styles.emptyText}>
            Agrega películas y series a favoritos desde sus detalles.{"\n"}
            Mantén presionado aquí para quitar un favorito.
          </Text>
        </View>
      )}
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
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSpacer: {
    width: 40,
  },
  gridContainer: {
    padding: 16,
  },
  favoriteItem: {
    flex: 1 / 3,
    margin: 4,
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  favoritePoster: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default FavoritesScreen;
