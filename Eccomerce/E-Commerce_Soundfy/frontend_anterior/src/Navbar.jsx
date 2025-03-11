import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [section, setSection] = useState(null); // Controlar qué sección mostrar

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleClick = () => {
    navigate('/sesion');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleRegisterProductClick = () => {
    navigate('/CrearProductos');
  };

  const handlePerfilClick = () => {
    navigate('/perfil');
  };

  const handleUserCircleClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMenuVisible(false);
    navigate('/');
  };

  const handleSectionClick = (sectionName) => {
    setSection(sectionName); // Cambiar la sección activa
  };

  const handleCloseModal = () => {
    setSection(null); // Cerrar la vista actual
  };

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={handleBackClick}>
        <img
          src="/image/spotify.jpg" // Asegúrate de tener el logo en esta ruta
          alt="Logo Soundfy"
          className="logo"
        />
        <h1 className="title">Soundfy</h1>
      </div>
      <ul className="nav-links">
        <li><a href="#about" onClick={() => handleSectionClick('about')}>Sobre mí</a></li>
        <li><a href="#services" onClick={() => handleSectionClick('services')}>Servicios</a></li>
        <li>
          {user ? (
            <div className="user-container">
              <div className="user-circle" onClick={handleUserCircleClick}>
                {user.username[0].toUpperCase()}
              </div>
              {menuVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={handlePerfilClick}>Perfil</li>
                    <li onClick={handleRegisterProductClick}>Añadir Producto</li>
                    <li onClick={handleLogout}>Salir</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary" onClick={handleClick}>
              Usuario
            </button>
          )}
        </li>
      </ul>

      {/* Mostrar el contenido sobre el usuario o los servicios */}
      {section === 'about' && (
        <div className="modal-content">
          <button className="close-btn" onClick={handleCloseModal}>X</button>
          <h2>Sobre Soundfy</h2>
          <p>Soundfy es una plataforma para descubrir música de todos los géneros. Nos dedicamos a ofrecer a los usuarios una experiencia única de streaming, personalizada según sus gustos y preferencias.</p>
        </div>
      )}
      {section === 'services' && (
        <div className="modal-content">
          <button className="close-btn" onClick={handleCloseModal}>X</button>
          <h2>Servicios de Soundfy</h2>
          <p>Ofrecemos servicios de streaming de música en alta calidad, recomendaciones personalizadas y creación de listas de reproducción. También brindamos la opción de subir y compartir música con otros usuarios.</p>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
