// Servicio de catálogo de productos: administra listados de productos, categorías e inventario.

import { musicData } from "../data"

class CatalogoServicio {
  async obtenerAlbumes(filtros = {}) {
    // Simulación de obtención de álbumes con filtros
    return new Promise((resolve) => {
      setTimeout(() => {
        let albumesFiltrados = [...musicData.albums]

        // Aplicar filtros si existen
        if (filtros.genero && filtros.genero !== "all") {
          albumesFiltrados = albumesFiltrados.filter((album) => album.genre === filtros.genero)
        }

        if (filtros.busqueda) {
          const termino = filtros.busqueda.toLowerCase()
          albumesFiltrados = albumesFiltrados.filter(
            (album) => album.title.toLowerCase().includes(termino) || album.artist.toLowerCase().includes(termino),
          )
        }

        // Aplicar ordenamiento
        if (filtros.ordenar) {
          switch (filtros.ordenar) {
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
        }

        resolve(albumesFiltrados)
      }, 500)
    })
  }

  async obtenerAlbumPorId(id) {
    // Simulación de obtención de un álbum por ID
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const album = musicData.albums.find((album) => album.id === Number.parseInt(id))

        if (album) {
          resolve(album)
        } else {
          reject(new Error("Álbum no encontrado"))
        }
      }, 300)
    })
  }

  async obtenerGeneros() {
    // Simulación de obtención de géneros únicos
    return new Promise((resolve) => {
      setTimeout(() => {
        const generos = ["all", ...new Set(musicData.albums.map((album) => album.genre))]
        resolve(generos)
      }, 200)
    })
  }

  async obtenerAlbumesDestacados() {
    // Simulación de obtención de álbumes destacados
    return new Promise((resolve) => {
      setTimeout(() => {
        const albumesDestacados = musicData.albums.slice(0, 4)
        resolve(albumesDestacados)
      }, 300)
    })
  }

  async obtenerNuevosLanzamientos() {
    // Simulación de obtención de nuevos lanzamientos
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevosLanzamientos = musicData.albums
          .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
          .slice(0, 4)
        resolve(nuevosLanzamientos)
      }, 300)
    })
  }

  async obtenerMasVendidos() {
    // Simulación de obtención de álbumes más vendidos
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un entorno real, esto se basaría en datos de ventas reales
        const masVendidos = [...musicData.albums].sort(() => 0.5 - Math.random()).slice(0, 4)
        resolve(masVendidos)
      }, 300)
    })
  }

  async obtenerAlbumesRelacionados(albumId, genero) {
    // Simulación de obtención de álbumes relacionados por género
    return new Promise((resolve) => {
      setTimeout(() => {
        const albumesRelacionados = musicData.albums
          .filter((album) => album.genre === genero && album.id !== Number.parseInt(albumId))
          .slice(0, 4)
        resolve(albumesRelacionados)
      }, 300)
    })
  }

  async verificarDisponibilidad(albumId, formato) {
    // Simulación de verificación de disponibilidad de inventario
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un entorno real, esto verificaría el inventario actual
        const disponible = Math.random() > 0.1 // 90% de probabilidad de estar disponible
        resolve({
          disponible,
          stock: disponible ? Math.floor(Math.random() * 50) + 1 : 0,
        })
      }, 200)
    })
  }
}

export const catalogoServicio = new CatalogoServicio()

