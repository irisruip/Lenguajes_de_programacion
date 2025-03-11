"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Auth.css"
import { usuarioServicio } from "./servicios/UsuarioServicio"
import axios from "axios"

function Registro() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    const payload = {
      nombre,
      email,
      password,
      direccion,
      telefono,
    }

    try {
      const response = await axios.post("/api/users/registro/", payload)
      if (response.status === 200) {
        alert("Usuario registrado con éxito.")
        window.location.href = "/"
      }
    } catch (err) {
      setError("Error al registrar. Por favor, inténtalo de nuevo.")
      console.error(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input type="text" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registro

