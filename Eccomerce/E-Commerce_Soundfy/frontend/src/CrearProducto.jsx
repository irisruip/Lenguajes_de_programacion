import React, { useState } from 'react';
import axios from 'axios';
import './CrearProducto.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const CrearProducto = () => {
    const navigate = useNavigate();

    const generateRandomSku = () => {
        const length = Math.floor(Math.random() * 5) + 8; // Genera un número entre 8 y 12
        return Math.floor(Math.random() * Math.pow(10, length)).toString();
    };

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: 1,
        artista: '',
        album: '',
        imagen: '',
        estado_disponibilidad: 'disponible',
        sku: generateRandomSku(),
    });

    const categorias = [
        { id: 1, nombre: "Vinilos" },
        { id: 2, nombre: "CDs" },
        { id: 3, nombre: "Discos" },
        { id: 4, nombre: "Cassettes" },
    ];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.stock) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Obtener usuario del localStorage
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || !user.id) {
            alert('Usuario no encontrado. Por favor, inicia sesión.');
            return;
        }

        const producto = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            precio: formData.precio,
            stock: parseInt(formData.stock),
            categoria_id: parseInt(formData.categoria_id),
            artista: formData.artista,
            album: formData.album,
            imagen: formData.imagen,
            estado_disponibilidad: formData.estado_disponibilidad,
            sku: formData.sku,
            usuario: user.id, // Añadir el ID del usuario al objeto producto
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
        };

        try {
            const response = await axios.post('/api/productos/', producto);
            console.log('Producto creado:', response.data);
            alert('Producto creado con éxito.');
            setFormData({
                titulo: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria_id: 1,
                artista: '',
                album: '',
                imagen: '',
                estado_disponibilidad: 'disponible',
                sku: generateRandomSku(),
            });
            navigate('/'); // Navegar a la página principal
        } catch (error) {
            console.error('Error al crear el producto:', error.response?.data);
            alert('Hubo un error al crear el producto.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="hoja">
                <div className="crear-producto-container">
                    <h1 className="titulo">Crear Producto de Música</h1>
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="campo mediano">
                            <label htmlFor="titulo">Título</label>
                            <input
                                type="text"
                                id="titulo"
                                placeholder="Título del producto"
                                value={formData.titulo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo-grande">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                placeholder="Descripción del producto"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo-doble">
                            <div className="campo pequeno">
                                <label htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    placeholder="Precio"
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="campo pequeno">
                                <label htmlFor="stock">Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    placeholder="Stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="artista">Artista</label>
                            <input
                                type="text"
                                id="artista"
                                placeholder="Artista del álbum"
                                value={formData.artista}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="album">Álbum</label>
                            <input
                                type="text"
                                id="album"
                                placeholder="Álbum del producto"
                                value={formData.album}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="imagen">URL de la Imagen</label>
                            <input
                                type="text"
                                id="imagen"
                                placeholder="URL de la imagen"
                                value={formData.imagen}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="estado_disponibilidad">Estado de Disponibilidad</label>
                            <select
                                id="estado_disponibilidad"
                                value={formData.estado_disponibilidad}
                                onChange={handleInputChange}
                            >
                                <option value="disponible">Disponible</option>
                                <option value="no_disponible">No Disponible</option>
                            </select>
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="categoria_id">Categoría</label>
                            <select
                                id="categoria_id"
                                value={formData.categoria_id}
                                onChange={handleInputChange}
                            >
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="boton-crear-producto">
                            Crear Producto
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CrearProducto;
