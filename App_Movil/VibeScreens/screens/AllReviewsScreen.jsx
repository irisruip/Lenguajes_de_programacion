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
import { useMovies } from "../context/MovieContext";

const AllReviewsScreen = ({ route, navigation }) => {
  const { contentId, contentTitle, contentType, posterPath } = route.params;
  const { getReviewsForContent } = useMovies();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsUnsubscribe, setReviewsUnsubscribe] = useState(null);

  useEffect(() => {
    const unsubscribe = getReviewsForContent(
      contentId,
      contentType,
      (contentReviews) => {
        setReviews(contentReviews);
        setLoading(false);
      }
    );

    setReviewsUnsubscribe(() => unsubscribe);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [contentId, contentType]);

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#ffd700" />
              <Text style={styles.ratingText}>{item.rating}/5</Text>
            </View>
          </View>
        </View>
        <Text style={styles.reviewDate}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString("es-ES")
            : "Fecha desconocida"}
        </Text>
      </View>

      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
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
        <View style={styles.headerContent}>
          <Image
            source={{
              uri: posterPath
                ? `https://image.tmdb.org/t/p/w200${posterPath}`
                : "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(contentTitle) +
                  "&background=1a1a2e&color=fff&size=100",
            }}
            style={styles.poster}
          />
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle} numberOfLines={2}>
              {contentTitle}
            </Text>
            <Text style={styles.contentType}>
              {contentType === "movie" ? "Película" : "Serie"}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Reviews List */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Todas las reseñas ({reviews.length})
          </Text>
        </View>

        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reviewsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No hay reseñas aún</Text>
            <Text style={styles.emptySubtext}>
              Sé el primero en compartir tu opinión sobre este contenido
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
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  contentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  contentType: {
    fontSize: 14,
    color: "#ff6b6b",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  reviewsList: {
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
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

export default AllReviewsScreen;
