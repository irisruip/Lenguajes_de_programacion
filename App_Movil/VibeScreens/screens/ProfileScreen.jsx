import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import { useMovies } from "../context/MovieContext";
import { API_KEY } from "@env";

const auth = getAuth(appFirebase);

// Datos de ejemplo para las películas favoritas - REMOVED

// Datos de ejemplo para las listas de películas
const listsData = [
  {
    id: "1",
    title: "Para ver con amigos",
    count: 12,
    coverPath: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
  },
  {
    id: "2",
    title: "Películas de terror",
    count: 8,
    coverPath: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    id: "3",
    title: "Clásicos que debo ver",
    count: 15,
    coverPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
];

// Datos de ejemplo para amigos
const friendsData = [
  {
    id: "1",
    name: "Brad Pitt",
    avatar: "https://via.placeholder.com/150",
    mutualMovies: 15,
  },
  {
    id: "2",
    name: "Lana del Rey",
    avatar: "https://via.placeholder.com/150",
    mutualMovies: 8,
  },
  {
    id: "3",
    name: "Jennifer Lawrence",
    avatar: "https://via.placeholder.com/150",
    mutualMovies: 23,
  },
  {
    id: "4",
    name: "Luis Miguel",
    avatar: "https://via.placeholder.com/150",
    mutualMovies: 12,
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { getUserLists, getUserFavorites, getUserReviews } = useMovies();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: "Usuario",
    email: "",
    photoURL: null,
  });
  const [lists, setLists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enrichedReviews, setEnrichedReviews] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    // Obtener información del usuario actual
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserInfo({
        displayName: currentUser.displayName || "Usuario",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL,
      });

      // Obtener listas del usuario
      const unsubscribeLists = getUserLists(currentUser.uid, (userLists) => {
        setLists(userLists);
      });

      // Obtener favoritos del usuario
      const unsubscribeFavorites = getUserFavorites(
        currentUser.uid,
        (userFavorites) => {
          setFavorites(userFavorites.slice(0, 4)); // Mostrar solo las últimas 3-4
          setFavoritesLoading(false);
        }
      );

      // Obtener reseñas del usuario
      const unsubscribeReviews = getUserReviews(
        currentUser.uid,
        async (userReviews) => {
          setReviews(userReviews);

          // Enriquecer las reseñas con información de TMDb
          const enriched = await Promise.all(
            userReviews.slice(0, 3).map(async (review) => {
              let backdropPath = null;
              let contentTitle = review.title || "Contenido desconocido";

              try {
                const response = await fetch(
                  `https://api.themoviedb.org/3/${review.type}/${review.contentId}?api_key=${API_KEY}&language=es-MX`
                );
                if (response.ok) {
                  const contentData = await response.json();
                  backdropPath = contentData.backdrop_path;
                  contentTitle =
                    contentData.title || contentData.name || review.title;
                }
              } catch (error) {
                console.warn(
                  `Error fetching content info for ${review.contentId}:`,
                  error
                );
              }

              return {
                ...review,
                backdropPath,
                contentTitle,
              };
            })
          );

          setEnrichedReviews(enriched);
          setReviewsLoading(false);
        }
      );

      return () => {
        unsubscribeLists();
        unsubscribeFavorites();
        unsubscribeReviews();
      }; // Limpiar las suscripciones al desmontar
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Navegar a la pantalla de edición de perfil
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => {
        // Navigate to movie or series detail
        if (item.type === "tv") {
          navigation.navigate("Inicio", {
            screen: "SeriesDetail",
            params: { seriesId: item.contentId },
          });
        } else {
          navigation.navigate("Inicio", {
            screen: "MovieDetail",
            params: { movieId: item.contentId },
          });
        }
      }}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(item.title) +
              "&background=1a1a2e&color=fff&size=150",
        }}
        style={styles.favoritePoster}
      />
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("ListDetail", { listId: item.id })}
    >
      <Image
        source={{
          uri: item.coverPath
            ? `https://image.tmdb.org/t/p/w500${item.coverPath}`
            : "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(item.name) +
              "&background=1a1a2e&color=fff&size=200",
        }}
        style={styles.listCover}
      />
      <View style={styles.listOverlay} />
      <View style={styles.listInfo}>
        <Text style={styles.listTitle}>{item.name}</Text>
        <Text style={styles.listCount}>{item.movieCount || 0} películas</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image
        source={{
          uri:
            item.avatar ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(item.name) +
              "&background=1a1a2e&color=fff&size=50",
        }}
        style={styles.friendAvatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendMutual}>
          {item.mutualMovies} películas en común
        </Text>
      </View>
      <TouchableOpacity style={styles.friendActionButton}>
        <Ionicons name="chatbubble-outline" size={20} color="#ff6b6b" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{
              uri:
                userInfo.photoURL ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(userInfo.displayName) +
                  "&background=1a1a2e&color=fff&size=150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userInfo.displayName}</Text>
          <Text style={styles.bio}>{userInfo.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favoritas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{lists.length}</Text>
              <Text style={styles.statLabel}>Listas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviews.length}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favoritas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {favoritesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ff6b6b" />
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis listas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CreateList")}>
            <Ionicons name="add" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Nueva sección de reseñas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis reseñas</Text>
          {reviews.length > 3 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("UserReviews")}
            >
              <Text style={styles.seeAllButton}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>
        {reviewsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ff6b6b" />
          </View>
        ) : enrichedReviews.length === 0 ? (
          <View style={styles.emptyCollection}>
            <Ionicons name="chatbubble-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No has escrito reseñas aún</Text>
            <Text style={styles.emptySubtext}>
              Comparte tu opinión sobre películas y series
            </Text>
          </View>
        ) : (
          <FlatList
            data={enrichedReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reviewItemContainer}
                onPress={() => {
                  if (item.type === "movie") {
                    navigation.navigate("Inicio", {
                      screen: "MovieDetail",
                      params: { movieId: item.contentId },
                    });
                  } else {
                    navigation.navigate("Inicio", {
                      screen: "SeriesDetail",
                      params: { seriesId: item.contentId },
                    });
                  }
                }}
              >
                <Image
                  source={{
                    uri: item.backdropPath
                      ? `https://image.tmdb.org/t/p/w780${item.backdropPath}`
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(item.contentTitle || "No Image") +
                        "&background=1a1a2e&color=fff&size=300",
                  }}
                  style={styles.reviewBackdrop}
                />
                <View style={styles.reviewOverlay}>
                  <View style={styles.reviewTopLeftTitle}>
                    <Text style={styles.reviewTitle} numberOfLines={1}>
                      {item.contentTitle}
                    </Text>
                  </View>
                  <View style={styles.reviewTopRight}>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={12} color="#ffd700" />
                      <Text style={styles.reviewRatingText}>
                        {item.rating}/5
                      </Text>
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
                      {item.username}
                    </Text>
                    <Text style={styles.reviewContent} numberOfLines={2}>
                      {item.text}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString("es-ES")
                        : "Fecha desconocida"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
          />
        )}
      </View>

      {/* Nueva sección de amigos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Amigos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.friendsContainer}>
          <FlatList
            data={friendsData}
            keyExtractor={(item) => item.id}
            renderItem={renderFriendItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
          <TouchableOpacity style={styles.addFriendButton}>
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.addFriendText}>Añadir amigos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => navigation.navigate("CompleteProfile")}
        >
          <Ionicons name="person-add-outline" size={24} color="#fff" />
          <Text style={styles.settingsText}>Completar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleEditProfile}
        >
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.settingsText}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.settingsText}>Configuración</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Ionicons name="help-circle-outline" size={24} color="#fff" />
          <Text style={styles.settingsText}>Ayuda y soporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
          <Text style={[styles.settingsText, { color: "#ff6b6b" }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

//Estilos provicionales, se pasarán luego a un ThemeProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  loadingContainer: {
    height: 180, // Same height as favoritePoster
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  headerContent: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  seeAllButton: {
    fontSize: 14,
    color: "#ff6b6b",
  },
  favoriteItem: {
    marginRight: 12,
    position: "relative",
  },
  favoritePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  favoriteRating: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  favoriteRatingText: {
    color: "#ffd700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
  },
  listItem: {
    width: 200,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  listCover: {
    width: "100%",
    height: "100%",
  },
  listOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  listInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  listTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listCount: {
    color: "#ccc",
    fontSize: 12,
  },
  // Estilos para la sección de amigos
  friendsContainer: {
    marginTop: 8,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  friendMutual: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  friendActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  addFriendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  addFriendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  settingsSection: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingsText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 16,
  },
  // Estilos para reseñas (estilo HomeScreen)
  reviewsContainer: {
    paddingHorizontal: 2,
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
    right: 80,
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
    height: "60%",
  },
  reviewBottomLeft: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 80,
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
  emptySubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});

export default ProfileScreen;
