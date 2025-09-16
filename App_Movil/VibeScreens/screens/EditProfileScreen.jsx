import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const EditProfileScreen = ({ navigation }) => {
  // Estados para los campos del formulario
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error] = useState("");
  const [success] = useState("");

  // Cargar datos del usuario actual al montar el componente
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabecera con botón de regreso y título */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={{ width: 40 }}></View>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : null}

        {/* Sección de foto de perfil */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri:
                photoURL ||
                "https://static.vecteezy.com/system/resources/previews/023/465/688/non_2x/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector.jpg",
            }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información básica</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Sección de correo electrónico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Correo electrónico</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ingresa tu correo electrónico"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>
        </View>

        {/* Sección de cambio de contraseña */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar contraseña</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Ingresa tu nueva contraseña"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>
        </View>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              "Cerrar sesión",
              "¿Estás seguro de que quieres cerrar sesión?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Cerrar sesión",
                  onPress: () => {
                    auth.signOut();
                    // La navegación se manejará en App.js con onAuthStateChanged
                  },
                  style: "destructive",
                },
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: "#4cd964",
    fontSize: 14,
  },
  photoSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  changePhotoButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#aaa",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});

export default EditProfileScreen;
