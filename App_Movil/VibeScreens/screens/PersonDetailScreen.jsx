import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_KEY } from "@env";

const { width } = Dimensions.get("window");

const PersonDetailScreen = ({ route }) => {
  const { personId } = route.params;
  const navigation = useNavigation();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movies"); // 'movies' or 'tv'

  useEffect(() => {
    fetchPersonDetails();
  }, [personId]);

  const fetchPersonDetails = async () => {
    setLoading(true);
    try {
      // Fetch person details
      const personResponse = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}&language=es-MX`
      );
      const personData = await personResponse.json();

      // Fetch combined credits
      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}&language=es-MX`
      );
      const creditsData = await creditsResponse.json();

      setPerson(personData);
      setCredits(creditsData);
    } catch (error) {
      console.error("Error fetching person details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentPress = (item) => {
    if (item.media_type === "movie") {
      navigation.navigate("MovieDetail", { movieId: item.id });
    } else if (item.media_type === "tv") {
      navigation.navigate("SeriesDetail", { seriesId: item.id });
    }
  };

  const renderCreditItem = ({ item }) => {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : "N/A";
    const character = item.character || "Desconocido";

    return (
      <TouchableOpacity
        style={styles.creditItem}
        onPress={() => handleContentPress(item)}
      >
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
              : "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(title) +
                "&size=150&background=1a1a2e&color=fff",
          }}
          style={styles.creditPoster}
        />
        <View style={styles.creditInfo}>
          <Text style={styles.creditTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.creditYear}>{year}</Text>
          {character !== "Desconocido" && (
            <Text style={styles.creditCharacter} numberOfLines={1}>
              como {character}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (!person) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se pudo cargar la información de la persona
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

  const movieCredits =
    credits?.cast?.filter((item) => item.media_type === "movie") || [];
  const tvCredits =
    credits?.cast?.filter((item) => item.media_type === "tv") || [];
  const currentCredits = activeTab === "movies" ? movieCredits : tvCredits;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: person.profile_path
                ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
                : "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(person.name) +
                  "&size=150&background=1a1a2e&color=fff",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.personName}>{person.name}</Text>
            {person.known_for_department && (
              <Text style={styles.knownFor}>{person.known_for_department}</Text>
            )}
            {person.birthday && (
              <Text style={styles.birthInfo}>
                {`${new Date(person.birthday).toLocaleDateString("es-ES")}${
                  person.deathday
                    ? ` - ${new Date(person.deathday).toLocaleDateString(
                        "es-ES"
                      )}`
                    : ""
                }${person.place_of_birth ? ` • ${person.place_of_birth}` : ""}`}
              </Text>
            )}
          </View>
        </View>

        {/* Biography */}
        {person.biography && person.biography.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biografía</Text>
            <Text style={styles.biography}>
              {String(person.biography).trim().replace(/\s+/g, " ")}
            </Text>
          </View>
        )}

        {/* Credits Tabs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filmografía</Text>

          {/* Tab Buttons */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "movies" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("movies")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "movies" && styles.tabTextActive,
                ]}
              >
                Películas ({movieCredits.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "tv" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("tv")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "tv" && styles.tabTextActive,
                ]}
              >
                Series ({tvCredits.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Credits List */}
          {currentCredits.length > 0 ? (
            <FlatList
              data={currentCredits.slice(0, 20)} // Limit to 20 items
              keyExtractor={(item, index) =>
                `${item.id}_${item.media_type}_${index}`
              }
              renderItem={renderCreditItem}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noCreditsText}>
              No hay {activeTab === "movies" ? "películas" : "series"}{" "}
              registradas
            </Text>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingTop: 100,
  },
  profileSection: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  personName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  knownFor: {
    fontSize: 16,
    color: "#ff6b6b",
    marginBottom: 8,
    fontWeight: "500",
  },
  birthInfo: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  biography: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: "#ff6b6b",
  },
  tabText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  creditItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    overflow: "hidden",
  },
  creditPoster: {
    width: 60,
    height: 90,
  },
  creditInfo: {
    flex: 1,
    padding: 12,
  },
  creditTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  creditYear: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
  },
  creditCharacter: {
    fontSize: 12,
    color: "#ff6b6b",
    fontStyle: "italic",
  },
  noCreditsText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default PersonDetailScreen;
