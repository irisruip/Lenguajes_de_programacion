import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);


// Datos de ejemplo para las películas favoritas
const favoritesData = [
  {
    id: '1',
    title: 'Dune',
    posterPath: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    rating: 4.5,
  },
  {
    id: '2',
    title: 'The Batman',
    posterPath: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    rating: 4.2,
  },
  {
    id: '3',
    title: 'Everything Everywhere All at Once',
    posterPath: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    rating: 4.8,
  },
  {
    id: '4',
    title: 'Oppenheimer',
    posterPath: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    rating: 4.7,
  },
];

// Datos de ejemplo para las listas de películas
const listsData = [
  {
    id: '1',
    title: 'Para ver con amigos',
    count: 12,
    coverPath: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
  },
  {
    id: '2',
    title: 'Películas de terror',
    count: 8,
    coverPath: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  },
  {
    id: '3',
    title: 'Clásicos que debo ver',
    count: 15,
    coverPath: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },
];

// Datos de ejemplo para amigos
const friendsData = [
  {
    id: '1',
    name: 'Brad Pitt',
    avatar: 'https://via.placeholder.com/150',
    mutualMovies: 15,
  },
  {
    id: '2',
    name: 'Lana del Rey',
    avatar: 'https://via.placeholder.com/150',
    mutualMovies: 8,
  },
  {
    id: '3',
    name: 'Jennifer Lawrence',
    avatar: 'https://via.placeholder.com/150',
    mutualMovies: 23,
  },
  {
    id: '4',
    name: 'Luis Miguel',
    avatar: 'https://via.placeholder.com/150',
    mutualMovies: 12,
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: 'Usuario',
    email: '',
    photoURL: null
  });

  useEffect(() => {
    // Obtener información del usuario actual
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserInfo({
        displayName: currentUser.displayName || 'Usuario',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL
      });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity style={styles.favoriteItem}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.posterPath}`
        }}
        style={styles.favoritePoster}
      />
      <View style={styles.favoriteRating}>
        <Ionicons name="star" size={12} color="#ffd700" />
        <Text style={styles.favoriteRatingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.coverPath}`
        }}
        style={styles.listCover}
      />
      <View style={styles.listOverlay} />
      <View style={styles.listInfo}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listCount}>{item.count} películas</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.friendAvatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendMutual}>{item.mutualMovies} películas en común</Text>
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
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userInfo.displayName}</Text>
          <Text style={styles.bio}>{userInfo.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Películas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>35</Text>
              <Text style={styles.statLabel}>Listas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favoritas</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={favoritesData}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis listas</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={listsData}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
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
        <TouchableOpacity style={styles.settingsItem}>
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
          <Text style={[styles.settingsText, { color: '#ff6b6b' }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

//Estilos provicionales, se pasarán luego a un ThemeProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#ff6b6b',
  },
  favoriteItem: {
    marginRight: 12,
    position: 'relative',
  },
  favoritePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  favoriteRating: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  favoriteRatingText: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  listItem: {
    width: 200,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  listCover: {
    width: '100%',
    height: '100%',
  },
  listOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  listTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listCount: {
    color: '#ccc',
    fontSize: 12,
  },
  // Estilos para la sección de amigos
  friendsContainer: {
    marginTop: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  friendMutual: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  friendActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  addFriendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsSection: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
});

export default ProfileScreen;