import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  // Reemplazar con tu propia API en caso de tenerla
  const fetchProductos = async () => {
    try {
      // Usamos una API pública de ejemplo para productos musicales
      const response = await axios.get('https://fakestoreapi.com/products');
      setProductos(response.data);
    } catch (err) {
      setError('Error al obtener los productos');
      console.error('Error fetching productos:', err);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categoria/${categoryId}`);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Dividimos los productos en categorías simuladas (deberás adaptarlo a tus datos reales)
  const categorias = {
    vinilos: productos.filter(producto => producto.category === "vinyl"),
    cds: productos.filter(producto => producto.category === "cd"),
    discos: productos.filter(producto => producto.category === "disco"),
    cassettes: productos.filter(producto => producto.category === "cassette")
  };

  return (
    <div>
      <Navbar />
      <div className="main">
        <main>
          <div className="categorias">
            <h2>Categorías</h2>
            <ul>
              <li onClick={() => handleCategoryClick(1)}>Vinilos</li>
              <li onClick={() => handleCategoryClick(2)}>CDs</li>
              <li onClick={() => handleCategoryClick(3)}>Discos</li>
              <li onClick={() => handleCategoryClick(4)}>Cassetes</li>
            </ul>
          </div>

          <div className="productos-container">
            {Object.keys(categorias).map((categoria) => (
              <Rectangle key={categoria} title={categoria} productos={categorias[categoria]} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Rectangle({ title, productos = [] }) {
  const navigate = useNavigate();

  const handleProductClick = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  return (
    <div className="rectangle">
      <h3>{title}</h3>
      {productos.length > 0 ? (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="product-card" onClick={() => handleProductClick(producto.id)}>
              <img src={producto.image || 'https://via.placeholder.com/150'} alt={producto.title} />
              <h4>{producto.title}</h4>
              <p>${producto.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
}

export default App;
