import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Firebase
import appFirebase from "./credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ExploreScreen from "./screens/ExploreScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import SeriesDetailScreen from "./screens/SeriesDetailScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import CreateListScreen from "./screens/CreateListScreen";
import ListDetailScreen from "./screens/ListDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";

// Context
import { MovieProvider } from "./context/MovieContext";
import { SeriesProvider } from "./context/SeriesContext";

const auth = getAuth(appFirebase);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Cada tab tiene su propio stack navigator
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <HomeStack.Screen name="SeriesDetail" component={SeriesDetailScreen} />
    </HomeStack.Navigator>
  );
}

function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreScreen" component={ExploreScreen} />
      <ExploreStack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <ExploreStack.Screen name="SeriesDetail" component={SeriesDetailScreen} />
    </ExploreStack.Navigator>
  );
}

function NotificationsStackScreen() {
  return (
    <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationsStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </NotificationsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="CreateList" component={CreateListScreen} />
      <ProfileStack.Screen name="ListDetail" component={ListDetailScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Buscar") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Notificaciones") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff6b6b",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackScreen} />
      <Tab.Screen name="Buscar" component={ExploreStackScreen} />
      <Tab.Screen name="Notificaciones" component={NotificationsStackScreen} />
      <Tab.Screen name="Perfil" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Manejar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Limpiar la suscripción al desmontar
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return null; // O un componente de carga
  }

  return (
    <MovieProvider>
      <SeriesProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
          <Stack.Navigator
            initialRouteName={user ? "MainApp" : "SignIn"}
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: "#1a1a2e" },
            }}
          >
            {user ? (
              <Stack.Screen name="MainApp" component={MainTabs} />
            ) : (
              <>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SeriesProvider>
    </MovieProvider>
  );
}
