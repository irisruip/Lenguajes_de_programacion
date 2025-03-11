import { Link } from "react-router-dom"
import "./Home.css"
import { musicData } from "./data"

function Inicio() {
  const albumsDestacados = musicData.albums.slice(0, 4)
  const nuevosLanzamientos = musicData.albums.slice(4, 8)
  const masVendidos = musicData.albums.slice(8, 12)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Descubre y Compra Tu Música Favorita</h1>
          <p>Escucha, descarga y colecciona copias físicas de la música que amas</p>
          <Link to="/explorar" className="btn">
            Explorar Música
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Álbumes Destacados</h2>
        <div className="album-grid">
          {albumsDestacados.map((album) => (
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
        <h2 className="section-title">Nuevos Lanzamientos</h2>
        <div className="album-grid">
          {nuevosLanzamientos.map((album) => (
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
        <h2 className="section-title">Más Vendidos</h2>
        <div className="album-grid">
          {masVendidos.map((album) => (
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
          <h2>Únete a Nuestra Comunidad Musical</h2>
          <p>Obtén ofertas exclusivas, acceso anticipado a nuevos lanzamientos y recomendaciones personalizadas.</p>
          <button className="btn">Regístrate Ahora</button>
        </div>
      </section>
    </div>
  )
}

export default Inicio

