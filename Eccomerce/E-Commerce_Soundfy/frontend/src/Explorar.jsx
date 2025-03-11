"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Browse.css"
import { musicData } from "./data"

function Explorar() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar y ordenar álbumes
  let albumesFiltrados = [...musicData.albums]

  // Aplicar filtro de género
  if (filter !== "all") {
    albumesFiltrados = albumesFiltrados.filter((album) => album.genre === filter)
  }

  // Aplicar filtro de búsqueda
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    albumesFiltrados = albumesFiltrados.filter(
      (album) => album.title.toLowerCase().includes(query) || album.artist.toLowerCase().includes(query),
    )
  }

  // Aplicar ordenamiento
  switch (sortBy) {
    case "price-low":
      albumesFiltrados.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      albumesFiltrados.sort((a, b) => b.price - a.price)
      break
    case "a-z":
      albumesFiltrados.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "newest":
    default:
      albumesFiltrados.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      break
  }

  // Obtener géneros únicos para el filtro
  const generos = ["all", ...new Set(musicData.albums.map((album) => album.genre))]

  return (
    <div className="browse">
      <h1 className="page-title">Explorar Música</h1>

      <div className="browse-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar álbumes o artistas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort">
          <div className="filter-container">
            <label htmlFor="filter">Filtrar por Género:</label>
            <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              {generos.map((genero) => (
                <option key={genero} value={genero}>
                  {genero === "all" ? "Todos" : genero.charAt(0).toUpperCase() + genero.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-container">
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {albumesFiltrados.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron álbumes que coincidan con tus criterios.</p>
          <button
            className="btn"
            onClick={() => {
              setFilter("all")
              setSortBy("newest")
              setSearchQuery("")
            }}
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="album-grid">
          {albumesFiltrados.map((album) => (
            <Link to={`/album/${album.id}`} key={album.id} className="album-card">
              <div className="album-image">
                <img src={album.cover || "/placeholder.svg"} alt={album.title} />
              </div>
              <div className="album-info">
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p className="album-genre">{album.genre}</p>
                <p className="album-price">${album.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Explorar

