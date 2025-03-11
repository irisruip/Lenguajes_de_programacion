"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "./CarritoContext"
import "./AlbumDetail.css"
import { musicData } from "./data"

function DetalleAlbum() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [formato, setFormato] = useState("digital")
  const [pestañaActiva, setPestañaActiva] = useState("description")

  // Encontrar el álbum por id
  const album = musicData.albums.find((album) => album.id === Number.parseInt(id))

  if (!album) {
    return (
      <div className="not-found">
        <h2>Álbum No Encontrado</h2>
        <p>Lo sentimos, el álbum que estás buscando no existe.</p>
        <Link to="/explorar" className="btn">
          Explorar Álbumes
        </Link>
      </div>
    )
  }

  // Calcular precio basado en formato
  let precioFinal = album.price
  if (formato === "cd") precioFinal += 5
  if (formato === "vinyl") precioFinal += 15

  // Manejar añadir al carrito
  const handleAddToCart = () => {
    addToCart({
      id: album.id,
      title: album.title,
      artist: album.artist,
      cover: album.cover,
      price: precioFinal,
      format: formato,
      quantity: cantidad,
    })
  }

  // Encontrar álbumes relacionados (mismo género)
  const albumesRelacionados = musicData.albums.filter((a) => a.genre === album.genre && a.id !== album.id).slice(0, 4)

  return (
    <div className="album-detail">
      <div className="album-detail-container">
        <div className="album-detail-left">
          <div className="album-cover">
            <img src={album.cover || "/placeholder.svg"} alt={album.title} />
          </div>
        </div>

        <div className="album-detail-right">
          <h1 className="album-title">{album.title}</h1>
          <h2 className="album-artist">{album.artist}</h2>

          <div className="album-meta">
            <span className="album-genre">{album.genre}</span>
            <span className="album-release">Lanzamiento: {new Date(album.releaseDate).toLocaleDateString()}</span>
          </div>

          <div className="album-price-container">
            <span className="album-price">${precioFinal.toFixed(2)}</span>

            <div className="format-selector">
              <label>
                <input
                  type="radio"
                  name="format"
                  value="digital"
                  checked={formato === "digital"}
                  onChange={() => setFormato("digital")}
                />
                <span>Descarga Digital</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="format"
                  value="cd"
                  checked={formato === "cd"}
                  onChange={() => setFormato("cd")}
                />
                <span>CD (+$5.00)</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="format"
                  value="vinyl"
                  checked={formato === "vinyl"}
                  onChange={() => setFormato("vinyl")}
                />
                <span>Vinilo (+$15.00)</span>
              </label>
            </div>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Cantidad:</label>
            <div className="quantity-controls">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} aria-label="Disminuir cantidad">
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Number.parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setCantidad(cantidad + 1)} aria-label="Aumentar cantidad">
                +
              </button>
            </div>
          </div>

          <div className="album-actions">
            <button className="btn" onClick={handleAddToCart}>
              Añadir al Carrito
            </button>
            <button className="btn btn-secondary">Añadir a Lista de Deseos</button>
          </div>

          <div className="album-tabs">
            <div className="tab-headers">
              <button
                className={pestañaActiva === "description" ? "active" : ""}
                onClick={() => setPestañaActiva("description")}
              >
                Descripción
              </button>
              <button className={pestañaActiva === "tracks" ? "active" : ""} onClick={() => setPestañaActiva("tracks")}>
                Pistas
              </button>
              <button
                className={pestañaActiva === "reviews" ? "active" : ""}
                onClick={() => setPestañaActiva("reviews")}
              >
                Reseñas
              </button>
            </div>

            <div className="tab-content">
              {pestañaActiva === "description" && (
                <div className="tab-description">
                  <p>{album.description}</p>
                </div>
              )}

              {pestañaActiva === "tracks" && (
                <div className="tab-tracks">
                  <ol className="track-list">
                    {album.tracks.map((track, index) => (
                      <li key={index} className="track-item">
                        <span className="track-title">{track.title}</span>
                        <span className="track-duration">{track.duration}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {pestañaActiva === "reviews" && (
                <div className="tab-reviews">
                  {album.reviews && album.reviews.length > 0 ? (
                    <div className="reviews-list">
                      {album.reviews.map((review, index) => (
                        <div key={index} className="review-item">
                          <div className="review-header">
                            <span className="review-author">{review.user}</span>
                            <span className="review-rating">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <span key={i} className={i < review.rating ? "star filled" : "star"}>
                                    ★
                                  </span>
                                ))}
                            </span>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p className="review-text">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Aún no hay reseñas. ¡Sé el primero en reseñar este álbum!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {albumesRelacionados.length > 0 && (
        <div className="related-albums">
          <h2 className="section-title">También Te Puede Gustar</h2>
          <div className="album-grid">
            {albumesRelacionados.map((album) => (
              <Link to={`/album/${album.id}`} key={album.id} className="album-card">
                <div className="album-image">
                  <img src={album.cover || "/placeholder.svg"} alt={album.title} />
                </div>
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>{album.artist}</p>
                  <p className="album-price">${album.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalleAlbum

