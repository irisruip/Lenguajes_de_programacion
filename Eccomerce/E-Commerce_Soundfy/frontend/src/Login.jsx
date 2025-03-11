"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Auth.css"
import { usuarioServicio } from "./servicios/UsuarioServicio"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Credenciales de prueba
    const testEmail = "prueba@correo.com"
    const testPassword = "123456"

    try {
      const response = await axios.post("/api/users/login/", {
        email: email,
        password: password,
      });

      if (response.data.status === "success") {
        const userData = response.data.user
        localStorage.setItem("user", JSON.stringify(userData))
        alert("Inicio de sesión exitoso.")
        window.location.href = "/" // Redirige a la página principal
      }
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      console.log(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login