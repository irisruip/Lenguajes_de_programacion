import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  // Estados para diferentes colecciones de películas
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [monthlyMovies, setMonthlyMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función genérica para obtener películas desde un endpoint
  const fetchMovies = async (endpoint, setter, isMonthlyMovies = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
      
      if (!response.ok) {
        console.warn(`Error en la solicitud a ${endpoint}: ${response.status}`);
        // Si falla la solicitud para películas del mes, usamos películas populares como respaldo
        if (isMonthlyMovies) {
          console.log("Usando películas populares como respaldo para películas del mes");
          const backupResponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            if (backupData.results && Array.isArray(backupData.results)) {
              setter(backupData.results.slice(0, 5));
              return;
            }
          }
        }
        throw new Error(`Error de API: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.results && Array.isArray(data.results)) {
        setter(data.results);
      } else {
        setter([]);
        console.warn(`No se encontraron resultados para ${endpoint}`);
      }
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
      setter([]); // Establecemos array vacío en caso de error
      if (!isMonthlyMovies) {
        setError(err.message);
      }
    }
  };

  // Función para obtener todas las colecciones de películas
  const fetchAllMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Calculamos el primer y último día del mes actual (para referencias, aunque aquí usamos now_playing)
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
      
      // Para películas del mes usamos el endpoint now_playing como aproximación
      const monthlyMoviesEndpoint = `/movie/now_playing`;
      
      await Promise.all([
        fetchMovies('/trending/movie/day', setTrendingMovies),
        fetchMovies('/movie/popular', setPopularMovies),
        fetchMovies('/movie/top_rated', setTopRatedMovies),
        fetchMovies(monthlyMoviesEndpoint, setMonthlyMovies, true)
      ]);
    } catch (err) {
      console.error('Error fetching all movies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para buscar películas según un query
  const searchMovies = async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`
      );
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      console.error('Error searching movies:', err);
      return [];
    }
  };

  const getMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-MX&append_to_response=credits,videos,watch/providers`
      );
      
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting movie details:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        trendingMovies,
        popularMovies,
        topRatedMovies,
        monthlyMovies,
        isLoading,
        error,
        searchMovies,
        getMovieDetails,
        refreshMovies: fetchAllMovies,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};