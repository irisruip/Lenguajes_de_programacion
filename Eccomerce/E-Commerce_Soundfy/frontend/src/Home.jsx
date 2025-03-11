import { Link } from "react-router-dom"
import "./Home.css"
import { musicData } from "./data"

function Home() {
  const featuredAlbums = musicData.albums.slice(0, 4)
  const newReleases = musicData.albums.slice(4, 8)
  const topSellers = musicData.albums.slice(8, 12)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover and Buy Your Favorite Music</h1>
          <p>Stream, download, and collect physical copies of the music you love</p>
          <Link to="/browse" className="btn">
            Browse Music
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Albums</h2>
        <div className="album-grid">
          {featuredAlbums.map((album) => (
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
      </section>

      <section className="new-releases-section">
        <h2 className="section-title">New Releases</h2>
        <div className="album-grid">
          {newReleases.map((album) => (
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
      </section>

      <section className="top-sellers-section">
        <h2 className="section-title">Top Sellers</h2>
        <div className="album-grid">
          {topSellers.map((album) => (
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
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Join Our Music Community</h2>
          <p>Get exclusive deals, early access to new releases, and personalized recommendations.</p>
          <button className="btn">Sign Up Now</button>
        </div>
      </section>
    </div>
  )
}

export default Home

