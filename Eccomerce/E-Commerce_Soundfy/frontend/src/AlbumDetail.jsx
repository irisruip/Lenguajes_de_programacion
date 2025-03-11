"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "./CartContext"
import "./AlbumDetail.css"
import { musicData } from "./data"

function AlbumDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [format, setFormat] = useState("digital")
  const [activeTab, setActiveTab] = useState("description")

  // Find the album by id
  const album = musicData.albums.find((album) => album.id === Number.parseInt(id))

  if (!album) {
    return (
      <div className="not-found">
        <h2>Album Not Found</h2>
        <p>Sorry, the album you're looking for doesn't exist.</p>
        <Link to="/browse" className="btn">
          Browse Albums
        </Link>
      </div>
    )
  }

  // Calculate price based on format
  let finalPrice = album.price
  if (format === "cd") finalPrice += 5
  if (format === "vinyl") finalPrice += 15

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: album.id,
      title: album.title,
      artist: album.artist,
      cover: album.cover,
      price: finalPrice,
      format,
      quantity,
    })
  }

  // Find related albums (same genre)
  const relatedAlbums = musicData.albums.filter((a) => a.genre === album.genre && a.id !== album.id).slice(0, 4)

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
            <span className="album-release">Released: {new Date(album.releaseDate).toLocaleDateString()}</span>
          </div>

          <div className="album-price-container">
            <span className="album-price">${finalPrice.toFixed(2)}</span>

            <div className="format-selector">
              <label>
                <input
                  type="radio"
                  name="format"
                  value="digital"
                  checked={format === "digital"}
                  onChange={() => setFormat("digital")}
                />
                <span>Digital Download</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="format"
                  value="cd"
                  checked={format === "cd"}
                  onChange={() => setFormat("cd")}
                />
                <span>CD (+$5.00)</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="format"
                  value="vinyl"
                  checked={format === "vinyl"}
                  onChange={() => setFormat("vinyl")}
                />
                <span>Vinyl (+$15.00)</span>
              </label>
            </div>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="album-actions">
            <button className="btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-secondary">Add to Wishlist</button>
          </div>

          <div className="album-tabs">
            <div className="tab-headers">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button className={activeTab === "tracks" ? "active" : ""} onClick={() => setActiveTab("tracks")}>
                Tracks
              </button>
              <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                <div className="tab-description">
                  <p>{album.description}</p>
                </div>
              )}

              {activeTab === "tracks" && (
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

              {activeTab === "reviews" && (
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
                    <p>No reviews yet. Be the first to review this album!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedAlbums.length > 0 && (
        <div className="related-albums">
          <h2 className="section-title">You May Also Like</h2>
          <div className="album-grid">
            {relatedAlbums.map((album) => (
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

export default AlbumDetail

