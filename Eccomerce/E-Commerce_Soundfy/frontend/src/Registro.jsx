import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

const RegistroUsuario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.username ||
        !formData.email || !formData.telefono || !formData.direccion ||
        !formData.fecha_nacimiento || !formData.password || !formData.confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const payload = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      fecha_nacimiento: formData.fecha_nacimiento,
      password: formData.password,
    };

    try {
      const response = await axios.post('/api/usuarios/', payload);

      if (response.status === 201) {
        alert('Usuario registrado con éxito.');
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error.response?.data || error.message);
      alert('Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <div className='registro-container'>
      <Navbar />
      <div className='registro-card'>
        <h1 className='registro-title'>Crea tu cuenta de Soundfy</h1>
        <form>
          {[
            { id: 'first_name', placeholder: 'Nombre' },
            { id: 'last_name', placeholder: 'Apellido' },
            { id: 'username', placeholder: 'Nombre de usuario' },
            { id: 'email', placeholder: 'Correo electrónico', type: 'email' },
            { id: 'telefono', placeholder: 'Teléfono' },
            { id: 'direccion', placeholder: 'Dirección' },
            { id: 'fecha_nacimiento', placeholder: 'Fecha de nacimiento', type: 'date' },
            { id: 'password', placeholder: 'Contraseña', type: 'password' },
            { id: 'confirmPassword', placeholder: 'Confirmar contraseña', type: 'password' },
          ].map(({ id, placeholder, type = 'text' }) => (
            <input
              key={id}
              type={type}
              id={id}
              placeholder={placeholder}
              value={formData[id]}
              onChange={handleInputChange}
              className='registro-input'
            />
          ))}
          <button type='submit' className='registro-button' onClick={handleRegisterClick}>
            Registrarse
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegistroUsuario;
