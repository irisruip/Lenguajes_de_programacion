import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  // Inicializamos con arrays vacíos en lugar de undefined
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [monthlyMovies, setMonthlyMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async (endpoint, setter, isMonthlyMovies = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
      
      if (!response.ok) {
        console.warn(`Error en la solicitud a ${endpoint}: ${response.status}`);
        
        // Si es la solicitud de películas mensuales y falla, usamos películas populares como respaldo
        if (isMonthlyMovies) {
          console.log("Usando películas populares como respaldo para películas del mes");
          // Hacemos una nueva solicitud a películas populares como respaldo
          const backupResponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
          
          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            if (backupData.results && Array.isArray(backupData.results)) {
              // Usamos solo las primeras 5 películas populares como "películas del mes"
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
        //Si no hay resultados se pasa un array vacío
        setter([]);
        console.warn(`No se encontraron resultados para ${endpoint}`);
      }
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
      setter([]); //En caso de error establecemos un array vacío otra vez
      //Esto es por si hay un error para que la aplicación siga funcionando
      if (!isMonthlyMovies) {
        setError(err.message);
      }
    }
  };

  const fetchAllMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      //Fecha actual para las películas del mes
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; //getMonth() devuelve 0-11
      
      //Formateamos para obtener el primer y último día del mes actual
      const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
      
      // Modificamos el endpoint para películas del mes para usar un enfoque diferente
      // En lugar de usar discover con fechas, usamos películas populares con un filtro diferente
      const monthlyMoviesEndpoint = `/movie/now_playing`;
      
      await Promise.all([
        fetchMovies('/trending/movie/day', setTrendingMovies),
        fetchMovies('/movie/popular', setPopularMovies),
        fetchMovies('/movie/top_rated', setTopRatedMovies),
        // Usamos now_playing en lugar de discover con fechas
        fetchMovies(monthlyMoviesEndpoint, setMonthlyMovies, true)
      ]);
    } catch (err) {
      console.error('Error fetching all movies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,reviews`
      );
      
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting movie details:', err);
      return null;
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
        refreshMovies: fetchAllMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};