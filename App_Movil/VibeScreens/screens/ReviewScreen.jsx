import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMovies } from "../context/MovieContext";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const ReviewScreen = ({ route, navigation }) => {
  const { contentId, contentTitle, contentType, posterPath } = route.params;
  const { createReview, hasUserReviewedContent } = useMovies();

  const [rating, setRating] = useState(5.0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (starRating) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      Alert.alert("Error", "Por favor escribe una reseña");
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert("Error", "La puntuación debe estar entre 1 y 5 estrellas");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "Debes estar autenticado para dejar una reseña");
      return;
    }

    setIsSubmitting(true);
    try {
      // Verificar si el usuario ya ha reseñado este contenido
      const hasReviewed = await hasUserReviewedContent(
        currentUser.uid,
        contentId,
        contentType
      );
      if (hasReviewed) {
        Alert.alert(
          "Error",
          "Ya has reseñado este contenido. Solo puedes dejar una reseña por contenido."
        );
        return;
      }

      await createReview(
        contentId,
        currentUser.uid,
        currentUser.displayName || "Usuario",
        rating,
        reviewText.trim(),
        contentType
      );

      Alert.alert("¡Éxito!", "Tu reseña ha sido publicada", [
        {
          text: "OK",
          onPress: () => {
            // Go back to the previous screen (HomeScreen or Detail screen)
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating review:", error);
      Alert.alert(
        "Error",
        "No se pudo publicar la reseña. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const stars = [];

    ratingOptions.forEach((option) => {
      const isSelected = option <= rating;
      stars.push(
        <TouchableOpacity
          key={option}
          onPress={() => handleStarPress(option)}
          style={styles.starButton}
        >
          <View style={styles.starContainer}>
            <Ionicons
              name={isSelected ? "star" : "star-outline"}
              size={24}
              color={isSelected ? "#ffd700" : "#666"}
            />
            <Text
              style={[
                styles.starText,
                { color: isSelected ? "#ffd700" : "#666" },
              ]}
            >
              {option}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });

    return stars;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escribir reseña</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{contentTitle}</Text>
            <Text style={styles.contentType}>
              {contentType === "movie" ? "Película" : "Serie"}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Puntuación</Text>
            <Text style={styles.ratingValue}>{rating}/5 ⭐</Text>
            <View style={styles.starsContainer}>{renderStars()}</View>
            <Text style={styles.ratingHint}>
              Toca una opción para seleccionar tu puntuación
            </Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Tu reseña</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Escribe tu opinión sobre esta película/serie..."
              placeholderTextColor="#666"
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {reviewText.length}/1000 caracteres
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Publicando..." : "Publicar reseña"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContainer: {
    flex: 1,
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
  content: {
    padding: 16,
  },
  contentInfo: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  contentType: {
    fontSize: 16,
    color: "#ff6b6b",
  },
  ratingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd700",
    textAlign: "center",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  starContainer: {
    alignItems: "center",
    minWidth: 50,
  },
  starText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  ratingHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  submitButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#666",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReviewScreen;
