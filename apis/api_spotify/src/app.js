const path = require('path');
const express = require('express');
const apiroutes = require('./routes/apiroutes.js');
const bodyParser = require('body-parser');

// Crear la aplicación de Express
const app = express();

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para procesar JSON y formularios

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Cargar rutas
app.use('/', apiroutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('api', {
        song: { title: 'Ejemplo', artist: 'Artista de ejemplo' },
        artist: null,
        album: null
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
