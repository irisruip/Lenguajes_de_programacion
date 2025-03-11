import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css'; // Asegúrate de agregar los estilos necesarios
import Navbar from './Navbar';
import Footer from './Footer';

function EditProfile() {
    const [profileData, setProfileData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
        direccion: '',
        password: '' // Se agrega el campo para la contraseña
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            // Simulando un perfil de prueba
            const mockUserData = {
                username: 'juanperez',
                first_name: 'Juan',
                last_name: 'Pérez',
                email: 'juan@correo.com',
                telefono: '1234567890',
                direccion: 'Calle Ficticia 123',
                password: '' // No llenamos la contraseña al obtener los datos
            };

            setProfileData(mockUserData); // Establece los datos simulados
            setLoading(false);
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si la contraseña está vacía, no la incluimos en los datos a enviar
        const { password, ...profileWithoutPassword } = profileData;
        const dataToUpdate = password ? { ...profileWithoutPassword, password } : profileWithoutPassword;

        console.log('Datos enviados:', dataToUpdate); // Verifica los datos enviados

        // Simulamos la actualización del perfil
        setTimeout(() => {
            alert('Perfil actualizado con éxito');
            navigate('/'); // Redirige al dashboard después de la actualización
        }, 500);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <h1 className="edit-profile-title">Editar Perfil</h1>
                    <form className="edit-profile-form" onSubmit={handleSubmit}>
                        <label className="edit-profile-label">Nombre de usuario:</label>
                        <input
                            className="edit-profile-input"
                            type="text"
                            name="username"
                            value={profileData.username || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Primer nombre:</label>
                        <input
                            className="edit-profile-input"
                            type="text"
                            name="first_name"
                            value={profileData.first_name || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Apellido:</label>
                        <input
                            className="edit-profile-input"
                            type="text"
                            name="last_name"
                            value={profileData.last_name || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Email:</label>
                        <input
                            className="edit-profile-input"
                            type="email"
                            name="email"
                            value={profileData.email || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Teléfono:</label>
                        <input
                            className="edit-profile-input"
                            type="tel"
                            name="telefono"
                            value={profileData.telefono || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Dirección:</label>
                        <input
                            className="edit-profile-input"
                            type="text"
                            name="direccion"
                            value={profileData.direccion || ''}
                            onChange={handleChange}
                        />

                        <label className="edit-profile-label">Nueva Contraseña (opcional):</label>
                        <input
                            className="edit-profile-input"
                            type="password"
                            name="password"
                            value={profileData.password || ''}
                            onChange={handleChange}
                        />

                        <button type="submit" className="edit-profile-button">Guardar Cambios</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;
