import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (username, password) => {
    setIsLoading(true);
    try {
      //Simulación de inicio de sesión
      //Aquí se conectaría el backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: '1', username, name: 'Usuario de Prueba' });
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username, email, password) => {
    setIsLoading(true);
    try {
      //Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: '1', username, email, name: username });
      return true;
    } catch (error) {
      console.error('Error al registrarse:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};