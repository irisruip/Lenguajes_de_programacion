import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const SeriesContext = createContext();

export const useSeries = () => useContext(SeriesContext);

export const SeriesProvider = ({ children }) => {
  // Estados para diferentes colecciones de series
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [onAirSeries, setOnAirSeries] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función genérica para obtener series desde un endpoint
  const fetchSeries = async (endpoint, setter) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
      if (!response.ok) {
        console.warn(`Error en la solicitud a ${endpoint}: ${response.status}`);
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
      setter([]);
      setError(err.message);
    }
  };

  // Función para obtener todas las colecciones de series
  const fetchAllSeries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSeries('/trending/tv/day', setTrendingSeries),
        fetchSeries('/tv/popular', setPopularSeries),
        fetchSeries('/tv/top_rated', setTopRatedSeries),
        fetchSeries('/tv/on_the_air', setOnAirSeries)
      ]);
    } catch (err) {
      console.error('Error fetching all series:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para buscar series según un query
  const searchSeries = async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`
      );
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      console.error('Error searching series:', err);
      return [];
    }
  };

  // Función para obtener los detalles de una serie (incluye créditos, reseñas, videos y proveedores)
  const getSeriesDetails = async (seriesId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=es-MX&append_to_response=credits,reviews,videos,watch/providers`
      );
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting series details:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchAllSeries();
  }, []);

  return (
    <SeriesContext.Provider
      value={{
        trendingSeries,
        popularSeries,
        topRatedSeries,
        onAirSeries,
        isLoading,
        error,
        searchSeries,
        getSeriesDetails,
        refreshSeries: fetchAllSeries,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
};