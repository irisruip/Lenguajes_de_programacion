# Guía para instalar y ejecutar la aplicación de VibeScreens

## Índice

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Notas Adicionales](#notas-adicionales)

## Descripción

VibeScreens es una aplicación móvil que utiliza la API de [TheMovieDB](https://www.themoviedb.org/) para ofrecer contenido dinámico. En este repositorio encontrarás el código fuente y las instrucciones necesarias para clonar, configurar y ejecutar la app en tus dispositivos mediante Expo Go.

## Requisitos Previos

- **Git**: Para clonar el repositorio.
- **Node.js y npm**: Asegúrate de tener instalados Node.js y npm.
- **Visual Studio Code (VSCode)**: Recomendado para editar el código.
- **Expo Go**: La aplicación en tu teléfono para visualizar la app.
- **API Key de TheMovieDB**: Necesaria para el correcto funcionamiento de la aplicación.

## Instalación

1. **Clonar el Repositorio**  
   Clonan el repositorio ejecutando el siguiente comando:

   ```bash
   git clone https://github.com/irisruip/Lenguajes_de_programacion.git

   ```

2. **Abrir Vscode**
   Abren la carpeta clonada en VSCode. La estructura de carpetas debería verse similar a la siguiente:

   Lenguajes_de_programacion/ <br>
   └── App_Movil/ <br>
   └── VibeScreens/ <br>
   ├── app/ <br>
   ├── assets/ <br>
   ├── context/ <br>
   ├── navigation/ <br>
   ├── screens/ <br>
   ├── .gitignore <br>
   ├── app.json <br>
   ├── App.jsx <br>
   └── ... (otros archivos)

3. **Navegar a la App**
   Se dirigen a la carpeta de la aplicación:

   ```bash
   cd App_Movil/VibeScreens

   ```

4. **Instalar Dependencias**
   Una vez dentro de la carpeta de la app, instalan las dependencias con:
   ```bash
   npm install
   ```

## Configuración

1. **Crear archivo .env**
   En la raíz del proyecto, crean un archivo llamado .env y agrega la siguiente línea con la API Key:
   `API_KEY=api_key_de_TheMovieDB`

2. **Alternativa en caso de errores**
   Si encuentran problemas al utilizar el archivo .env, pueden comentar la importación en MovieContext.jsx (ubicado en la carpeta context) y declarar la API Key directamente:

   `// import { API_KEY } from '@env';` <br>
   `const API_KEY = 'tu_api_key_de_TheMovieDB';`

## Ejecución de la Aplicación

1. **Descargar Expo Go**
   Descarguen e instalen la aplicación Expo Go en sus teléfonos desde este link en Drive debido a temas de compatibilidad esta versión es la que funciona

   link de descarga: https://drive.google.com/file/d/12yREu_-KUpYn0MCKLqqmoLz9ZHRwvmUU/view?usp=drive_link

2. **Iniciar el Servidor**
   Dentro de la carpeta VibeScreen, inician el servidor de Expo con:

   ```bash
   npx expo start

   ```

3. **Escanear el Código QR**
   Una vez iniciado, se generará un código QR. Abran Expo Go en sus teléfonos y escaneen el código para visualizar la aplicación. Asegurense de mantener la computadora encendida y conectada a la misma red local y también de no tener ninguna VPN activa.

## Notas Adicionales

- API Key: Si necesitas la API Key de TheMovieDB, contáctame para proporcionártela.

- Actualizaciones: Si se realizan cambios en el repositorio, asegúrate de hacer un git pull para mantener tu copia actualizada.

- Problemas: Verifica que tu archivo .env esté bien configurado y que tu red permita la comunicación entre tu computadora y tu dispositivo móvil.

### Endpoints principales de películas (`/movie/`)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/trending/movie/day` | GET | Obtener películas en tendencia del día (HomeScreen) |
| `/movie/popular` | GET | Obtener películas populares (HomeScreen, MovieContext) |
| `/movie/top_rated` | GET | Obtener películas mejor calificadas (HomeScreen, MovieContext) |
| `/movie/now_playing` | GET | Obtener películas en cartelera/estreno (MovieContext) |
| `/movie/upcoming` | GET | Obtener películas próximas a estrenarse (HomeScreen) |
| `/search/movie` | GET | Buscar películas por texto (MovieContext) |
| `/movie/{movie_id}` | GET | Obtener detalles completos de una película (MovieDetailScreen) |
| `/movie/{movie_id}/release_dates` | GET | Obtener fechas de estreno por región (MovieDetailScreen) |
| `/movie/{movie_id}/similar` | GET | Obtener películas similares (MovieDetailScreen) |
| `/movie/{movie_id}/external_ids` | GET | Obtener IDs externos (IMDb, Facebook, etc.) (MovieDetailScreen) |
| `/movie/{movie_id}/reviews` | GET | Obtener reseñas de TMDB (MovieDetailScreen) |
| `/movie/{movie_id}/videos` | GET | Obtener videos/trailers (MovieDetailScreen) |
| `/movie/{movie_id}/watch/providers` | GET | Obtener proveedores de streaming (MovieDetailScreen) |

### Endpoints principales de series (`/tv/`)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/trending/tv/day` | GET | Obtener series en tendencia del día (SeriesContext) |
| `/tv/popular` | GET | Obtener series populares (HomeScreen, SeriesContext) |
| `/tv/top_rated` | GET | Obtener series mejor calificadas (HomeScreen, SeriesContext) |
| `/tv/on_the_air` | GET | Obtener series al aire/en emisión (HomeScreen, SeriesContext) |
| `/search/tv` | GET | Buscar series por texto (SeriesContext) |
| `/tv/{series_id}` | GET | Obtener detalles completos de una serie (SeriesDetailScreen) |
| `/tv/{series_id}/content_ratings` | GET | Obtener clasificaciones por edad (SeriesDetailScreen) |
| `/tv/{series_id}/similar` | GET | Obtener series similares (SeriesDetailScreen) |
| `/tv/{series_id}/external_ids` | GET | Obtener IDs externos (IMDb, Facebook, etc.) (SeriesDetailScreen) |
| `/tv/{series_id}/reviews` | GET | Obtener reseñas de TMDB (SeriesDetailScreen) |
| `/tv/{series_id}/videos` | GET | Obtener videos/trailers (SeriesDetailScreen) |
| `/tv/{series_id}/watch/providers` | GET | Obtener proveedores de streaming (SeriesDetailScreen) |

### Endpoints de búsqueda y descubrimiento (`/search/`, `/discover/`)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/search/multi` | GET | Búsqueda general de películas y series (ExploreScreen) |
| `/discover/movie` | GET | Descubrir películas con filtros avanzados (ExploreScreen, HomeScreen) |
| `/discover/tv` | GET | Descubrir series con filtros avanzados (ExploreScreen, HomeScreen) |

### Endpoints de colecciones (`/collection/`)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/collection/{collection_id}` | GET | Obtener información de una colección (HomeScreen) |
| `/collection/{collection_id}/images` | GET | Obtener imágenes de una colección (HomeScreen) |

### Endpoints de personas (`/person/`)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/person/{person_id}` | GET | Obtener detalles de una persona (actor/actriz/director) (PersonDetailScreen) |
| `/person/{person_id}/combined_credits` | GET | Obtener filmografía completa de una persona (PersonDetailScreen) |
| `/search/person` | GET | Buscar personas por nombre (ExploreScreen) |

### Parámetros comunes utilizados

**Filtros de Discover:**
- `api_key`: Clave de API (requerido)
- `language`: Idioma de los resultados (es-MX, es-ES)
- `page`: Número de página
- `sort_by`: Ordenamiento (popularity.desc, vote_average.desc, etc.)
- `with_genres`: Filtrar por géneros
- `vote_average.gte`: Calificación mínima
- `primary_release_year` / `first_air_date_year`: Filtrar por año
- `with_watch_providers`: Filtrar por proveedores de streaming
- `watch_region`: Región para proveedores (MX para México)

**Parámetros de append_to_response:**
- `credits`: Información del reparto y equipo
- `videos`: Trailers y videos
- `watch/providers`: Servicios de streaming
- `reviews`: Reseñas de usuarios