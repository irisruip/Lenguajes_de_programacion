// SesionUsuario.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SesionUsuario.css';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

const SesionUsuario = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Verificación de usuario para prueba con datos locales
    if (email === 'juan@correo.com' && password === '1234') {
      const userData = {
        username: 'Juan',
        email: 'juan@correo.com',
        id: 1,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/'); // Redirige a la página principal o donde sea necesario
    } else {
      alert('Credenciales incorrectas.');
    }

    // Descomenta este bloque para mantener la autenticación por API cuando se requiere

    /*
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/usuarios/');
      const usuario = response.data.find(
        (user) => user.email === email && user.password === password
      );

      if (usuario) {
        const userData = {
          username: usuario.username,
          email: usuario.email,
          id: usuario.id,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); // Redirige a la página principal o donde sea necesario
      } else {
        alert('Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error. Por favor, intenta nuevamente.');
    }
    */
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/registro');
  };

  return (
    <div className="soundfy-body">
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Bienvenido a Soundfy</h1>
          <form onSubmit={handleLoginClick}>
            <label htmlFor="email" className="login-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="login-input"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={handleEmailChange}
            />

            <label htmlFor="password" className="login-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={handlePasswordChange}
            />

            <button type="submit" className="login-button">Ingresar</button>
          </form>
          <p className="login-footer">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="login-link" onClick={handleRegisterClick}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SesionUsuario;
