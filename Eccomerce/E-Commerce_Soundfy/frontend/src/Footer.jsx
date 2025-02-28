import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">Soundfy</h3>
          <p>Escucha la música que amas, donde quieras.</p>
        </div>

        <div className="footer-links">
          <a href="/privacidad" className="footer-link">Política de Privacidad</a>
          <a href="/terminos" className="footer-link">Términos y Condiciones</a>
          <a href="/contacto" className="footer-link">Contáctanos</a>
        </div>

        <div className="footer-contact">
          <p>📞 Teléfono: 0414-4500391</p>
          <p>📧 Email: contacto@soundfy.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
