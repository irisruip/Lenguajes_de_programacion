import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Simplemente navega a la pantalla principal sin autenticación
    navigation.replace('MainApp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.backgroundImageContainer}>
          <Image
            source={{ uri: 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' }}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logoCirclesContainer}>
            <View style={[styles.logoCircle, { backgroundColor: '#ff6b6b' }]} />
            <View style={[styles.logoCircle, { backgroundColor: '#1dd1a1' }]} />
            <View style={[styles.logoCircle, { backgroundColor: '#54a0ff' }]} />
          </View>
          <Text style={styles.logoText}>VibeScreens</Text>
        </View>

        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Se pueden registrar todos menos el que se llame Juan</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? Go to the </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginLink}>Login Page</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//Estilos provicionales, se pasarán luego a un ThemeProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCirclesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;