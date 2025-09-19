import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMovies } from "../context/MovieContext";
import { API_KEY } from "@env";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

// Componente para mostrar cada reseña (igual que HomeScreen)
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

const UserReviewsScreen = ({ navigation }) => {
  const { getUserReviews } = useMovies();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsUnsubscribe, setReviewsUnsubscribe] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = getUserReviews(currentUser.uid, (userReviews) => {
        // Enriquecer las reseñas con información de TMDb
        const enrichedReviews = userReviews.map(async (review) => {
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
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(enrichedReviews).then((enriched) => {
          setReviews(enriched);
          setLoading(false);
        });
      });

      setReviewsUnsubscribe(() => unsubscribe);
    }

    return () => {
      if (reviewsUnsubscribe) {
        reviewsUnsubscribe();
      }
    };
  }, []);

  const handleReviewPress = (review) => {
    // Navegar a los detalles del contenido según el tipo
    if (review.type === "movie") {
      navigation.navigate("Inicio", {
        screen: "MovieDetail",
        params: { movieId: review.contentId },
      });
    } else {
      navigation.navigate("Inicio", {
        screen: "SeriesDetail",
        params: { seriesId: review.contentId },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Cargando tus reseñas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis reseñas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReviewItem
                review={item}
                onPress={() => handleReviewPress(item)}
              />
            )}
            contentContainerStyle={styles.reviewsContainer}
            showsVerticalScrollIndicator={false}
            numColumns={1}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No has escrito reseñas aún</Text>
            <Text style={styles.emptySubtext}>
              Comparte tu opinión sobre películas y series para verlas aquí
            </Text>
          </View>
        )}
      </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
  content: {
    flex: 1,
  },
  reviewsContainer: {
    padding: 16,
  },
  reviewItemContainer: {
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    height: 200,
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
    maxWidth: "70%",
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
    maxWidth: "70%",
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
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default UserReviewsScreen;
