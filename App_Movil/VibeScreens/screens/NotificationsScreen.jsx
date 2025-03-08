import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Datos de ejemplo para las notificaciones
const sampleNotifications = [
  {
    id: '1',
    type: 'new_movie',
    title: 'Nueva película disponible',
    message: 'Dune: Part Two ya está disponible para ver',
    time: '2h',
    read: false,
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Recomendación para ti',
    message: 'Basado en tus gustos, te recomendamos ver Oppenheimer',
    time: '5h',
    read: true,
  },
  {
    id: '3',
    type: 'friend_activity',
    title: 'Actividad de amigos',
    message: 'Rodrigo acaba de ver The Batman',
    time: '1d',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Actualización de la app',
    message: 'VibeScreens se ha actualizado a la versión 2.0',
    time: '2d',
    read: true,
  },
];

const NotificationItem = ({ notification }) => {
  const getIconName = (type) => {
    switch (type) {
      case 'new_movie':
        return 'film';
      case 'recommendation':
        return 'thumbs-up';
      case 'friend_activity':
        return 'people';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        notification.read ? styles.readNotification : styles.unreadNotification,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName(notification.type)} size={24} color="#ff6b6b" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {sampleNotifications.length > 0 ? (
        <FlatList
          data={sampleNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#555" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      )}
    </View>
  );
};

//Estilos provicionales, se pasarán luego a un ThemeProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 5,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  unreadNotification: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  readNotification: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  moreButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationsScreen;