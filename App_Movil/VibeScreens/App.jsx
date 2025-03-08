import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ExploreScreen from './screens/ExploreScreen';

// Context
import { MovieProvider } from './context/MovieContext';
//Aquí se pondría el Auth Context

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6b6b',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#1a1a2e' }
          }}
        >
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </MovieProvider>
  );
}