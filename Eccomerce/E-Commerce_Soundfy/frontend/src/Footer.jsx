import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Soudfy</h3>
          <p>Tu tienda de música favorita.</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li>
              <a href="#">Sobre Nosotros</a>
            </li>
            <li>
              <a href="#">Contacto</a>
            </li>
            <li>
              <a href="#">Centro de Ayuda</a>
            </li>
            <li>
              <a href="#">Términos de Servicio</a>
            </li>
            <li>
              <a href="#">Política de Privacidad</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Conéctate Con Nosotros</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              Facebook
            </a>
            <a href="#" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" aria-label="YouTube">
              YouTube
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Boletín Informativo</h4>
          <p>Suscríbete para recibir actualizaciones sobre nuevos lanzamientos y ofertas especiales.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu dirección de correo" required />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Soudfy. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer

