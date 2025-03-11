"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import "./Perfil.css"
import { usuarioServicio } from "./servicios/UsuarioServicio"
import axios from "axios"

function Perfil() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")

  // Datos de formulario
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [pais, setPais] = useState("")

  // Estado para mensajes
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const { id } = useParams()
  console.log(id)

  useEffect(() => {
    const cargarUsuario = async () => {
      // obtener los parametros de la url

      try {
        const response = await axios.get(`/api/users/${id}/`)

        setUsuario(response.data)
        // Inicializar formulario con datos del usuario
        console.log(response.data)
        setNombre(response.data.nombre || "")
        setEmail(response.data.email || "")
        setTelefono(response.data.telefono || "")
        setDireccion(response.data.direccion || "")

      } catch (err) {
        setError("No se pudo cargar la información del perfil")
      } finally {
        setLoading(false)
      }
    }

    cargarUsuario()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje("")
    setError("")

    try {
      await usuarioServicio.actualizarPerfil({
        nombre,
        email,
        telefono,
        direccion,
      })

      setMensaje("Perfil actualizado correctamente")
    } catch (err) {
      setError("Error al actualizar el perfil")
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Cuenta</h1>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">{usuario.nombre.charAt(0).toUpperCase()}</div>
            <div className="user-name">{usuario.nombre}</div>
            <div className="user-email">{usuario.email}</div>
          </div>

          <nav className="profile-nav">
            <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
              Información Personal
            </button>
            <button className={activeTab === "address" ? "active" : ""} onClick={() => setActiveTab("address")}>
              Direcciones
            </button>
            <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
              Mis Pedidos
            </button>
            <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
              Cambiar Contraseña
            </button>
          </nav>

          <button className="btn btn-secondary logout-btn" onClick={() => usuarioServicio.cerrarSesion()}>
            Cerrar Sesión
          </button>
        </div>

        <div className="profile-main">
          {mensaje && <div className="profile-message success">{mensaje}</div>}
          {error && <div className="profile-message error">{error}</div>}

          {activeTab === "info" && (
            <div className="profile-section">
              <h2>Información Personal</h2>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>

                <button type="submit" className="btn">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}

          {activeTab === "address" && (
            <div className="profile-section">
              <h2>Mis Direcciones</h2>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input type="text" id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ciudad">Ciudad</label>
                    <input type="text" id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="codigoPostal">Código Postal</label>
                    <input
                      type="text"
                      id="codigoPostal"
                      value={codigoPostal}
                      onChange={(e) => setCodigoPostal(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pais">País</label>
                  <input type="text" id="pais" value={pais} onChange={(e) => setPais(e.target.value)} />
                </div>

                <button type="submit" className="btn">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-section">
              <h2>Mis Pedidos</h2>
              <div className="orders-list">
                <Link to="/pedidos" className="btn">
                  Ver Todos Mis Pedidos
                </Link>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="profile-section">
              <h2>Cambiar Contraseña</h2>
              <form className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input type="password" id="currentPassword" />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input type="password" id="newPassword" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                  <input type="password" id="confirmNewPassword" />
                </div>

                <button type="submit" className="btn">
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil

