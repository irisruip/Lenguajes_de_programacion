"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Browse.css"
import { musicData } from "./data"

function Browse() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter and sort albums
  let filteredAlbums = [...musicData.albums]

  // Apply genre filter
  if (filter !== "all") {
    filteredAlbums = filteredAlbums.filter((album) => album.genre === filter)
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredAlbums = filteredAlbums.filter(
      (album) => album.title.toLowerCase().includes(query) || album.artist.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  switch (sortBy) {
    case "price-low":
      filteredAlbums.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredAlbums.sort((a, b) => b.price - a.price)
      break
    case "a-z":
      filteredAlbums.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "newest":
    default:
      filteredAlbums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      break
  }

  // Get unique genres for filter
  const genres = ["all", ...new Set(musicData.albums.map((album) => album.genre))]

  return (
    <div className="browse">
      <h1 className="page-title">Browse Music</h1>

      <div className="browse-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search albums or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort">
          <div className="filter-container">
            <label htmlFor="filter">Filter by Genre:</label>
            <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-container">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAlbums.length === 0 ? (
        <div className="no-results">
          <p>No albums found matching your criteria.</p>
          <button
            className="btn"
            onClick={() => {
              setFilter("all")
              setSortBy("newest")
              setSearchQuery("")
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="album-grid">
          {filteredAlbums.map((album) => (
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

export default Browse

