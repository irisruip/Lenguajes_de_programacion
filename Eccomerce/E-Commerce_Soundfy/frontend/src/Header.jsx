"use client"

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CarritoContext";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleUserCircleClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMenuVisible(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Soundfy</h1>
        </Link>

        <div className="search-bar">
          <input type="text" placeholder="Buscar música, álbumes, artistas..." />
          <button className="search-button">Buscar</button>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/explorar">Explorar</Link></li>
            <li>

              <Link to="/carrito" className="cart-link">
                Carrito {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </li>
            <li>
              {user ? (
                <div className="user-container">
                  <div className="user-circle" onClick={handleUserCircleClick}>
                    {user.username[0].toUpperCase()}
                  </div>
                  {menuVisible && (
                    <div className="dropdown-menu">
                      <ul>
                        <li><Link to={`/perfil/${user.id}`}>Perfil</Link></li>
                        <li onClick={handleLogout}>Salir</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">Iniciar Sesión</Link>
              )}
            </li>
          </ul>
        </nav>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Alternar menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;