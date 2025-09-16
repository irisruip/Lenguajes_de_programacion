import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMovies } from "../context/MovieContext";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const CreateListScreen = ({ navigation }) => {
  const { createNewList } = useMovies();
  const [listName, setListName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateList = async () => {
    if (!listName.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre para la lista");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "Usuario no autenticado");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await createNewList(currentUser.uid, listName.trim(), "", isPublic);
      Alert.alert("Éxito", "Lista creada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating list:", error);
      Alert.alert("Error", "No se pudo crear la lista");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Lista</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nombre de la lista</Text>
        <TextInput
          style={styles.input}
          value={listName}
          onChangeText={setListName}
          placeholder="Ej: Películas de acción"
          placeholderTextColor="#666"
          maxLength={50}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Lista pública</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: "#767577", true: "#ff6b6b" }}
            thumbColor={isPublic ? "#fff" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.switchDescription}>
          {isPublic
            ? "Visible para todos los usuarios"
            : "Solo visible para ti"}
        </Text>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreateList}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Creando..." : "Crear Lista"}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#fff",
  },
  switchDescription: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateListScreen;
