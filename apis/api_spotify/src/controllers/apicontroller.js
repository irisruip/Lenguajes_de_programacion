// importa file system
const fs = require('fs');
const path = require('path');


function crearCancion(req, res) {
    res.render('create');
}

function eliminarCancion(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });

    }

    const songs = musicData.songs;
    const songId = req.params.song;

    console.log("Buscando canción con ID:", songId);

    // Buscar la canción
    const song = songs.find(s => s.title.toLowerCase().trim() === songId.toLowerCase().trim());

    if (song) {
        console.log("Canción encontrada:", song);
        const index = songs.indexOf(song);
        songs.splice(index, 1);


        const filePath = path.join(__dirname, 'music.json');
        fs.writeFileSync(filePath, JSON.stringify(musicData, null, 2));

        res.redirect('/');
    } else {
        console.log("Canción no encontrada");
        res.redirect('/');
    }
}

function eliminarAlbum(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });

    }

    const songs = musicData.songs;
    const albumId = req.params.album;

    console.log("Buscando canciones del album:", albumId);

    // Buscar las canciones del album
    const albumSongs = songs.filter(s => s.album.toLowerCase().trim() === albumId.toLowerCase().trim());

    for (let i = 0; i < albumSongs.length; i++) {
        console.log("Canción encontrada:", albumSongs[i]);
    }

    if (albumSongs.length > 0) {
        for (let i = 0; i < albumSongs.length; i++) {
            // Eliminar la canción
            const index = songs.indexOf(albumSongs[i]);
            songs.splice(index, 1);
        }

        // Escribir los datos actualizados en el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        fs.writeFileSync(filePath, JSON.stringify(musicData, null, 2));

        res.redirect('/');
    } else {
        console.log("Canciones no encontradas");
        res.redirect('/');
    }
}

function eliminarArtista(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });


    }

    const songs = musicData.songs;
    const artistId = req.params.artist;

    console.log("Buscando canciones del artista:", artistId);

    // Buscar las canciones del artista
    const artistSongs = songs.filter(s => s.artist.toLowerCase().trim() === artistId.toLowerCase().trim());

    for (let i = 0; i < artistSongs.length; i++) {
        console.log("Canción encontrada:", artistSongs[i]);

    }

    if (artistSongs.length > 0) {
        for (let i = 0; i < artistSongs.length; i++) {
            // Eliminar la canción
            const index = songs.indexOf(artistSongs[i]);
            songs.splice(index, 1);
        }

        // Escribir los datos actualizados en el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        fs.writeFileSync(filePath, JSON.stringify(musicData, null, 2));


        res.redirect('/');
    } else {
        console.log("Canciones no encontradas");
        res.redirect('/');
    }
}


function guardarCancion(req, res) {
    // Obtener los datos del cuerpo de la solicitud
    const newSong = req.body;

    // Leer el archivo music.json si existe
    const filePath = path.join(__dirname, 'music.json');
    let musicData = { songs: [] };

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    } catch (error) {
        console.log('Archivo no encontrado o vacío, creando nuevo archivo...');
    }


    const newId = musicData.songs.length ? musicData.songs[musicData.songs.length - 1].id + 1 : 1;
    newSong.id = newId;


    musicData.songs.push(newSong);

    fs.writeFileSync(filePath, JSON.stringify(musicData, null, 2));

    // Redirigir a la ruta de creación
    res.redirect('/crear');
}

function intermediate(req, res) {
    body = req.body;
    console.log("Body: ");
    console.log(body);
    res.redirect('/' + body.ruta);
}

function mostrarArtista(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    }
    catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });
    }

    const songs = musicData.songs;
    const artistId = req.params.artist;

    console.log("Buscando canciones del artista:", artistId);

    // Buscar las canciones del artista
    const artistSongs = songs.filter(s => s.artist.toLowerCase().trim() === artistId.toLowerCase().trim());

    for (let i = 0; i < artistSongs.length; i++) {
        console.log("Canción encontrada:", artistSongs[i]);
    }

    if (artistSongs.length > 0) {
        res.render('api', {
            song: null,
            artist: artistSongs,
            album: null
        });
    } else {
        console.log("Canciones no encontradas");
        res.render('api', {
            song: null,
            artist: [],
            album: []
        });
    }
}

function mostrarCancion(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });
    }

    const songs = musicData.songs; // Declarar correctamente la variable
    const songId = req.params.song; // Nombre correcto de la variable
    console.log("Buscando canción con ID:", songId);


    // Buscar la canción
    const song = songs.find(s => s.title.toLowerCase().trim() === songId.toLowerCase().trim());

    // imprime los nombres de las canciones
    console.log(songs.map(s => s.title));

    if (song) {
        console.log("Canción encontrada:", song);
        res.render('api', {
            song: song,
            artist: null,
            album: null
        }); // Enviar la canción como JSON
    } else {
        console.log("Canción no encontrada");
        res.render('api', {
            song: undefined,
            artist: null,
            album: null
        }); // Enviar un mensaje de error


    }
}

function mostrarAlbum(req, res) {
    let musicData = { songs: [] };

    try {
        // Leer el archivo music.json
        const filePath = path.join(__dirname, 'music.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        musicData = JSON.parse(fileContent);
    }
    catch (error) {
        console.error('Error al leer el archivo music.json:', error);
        return res.status(500).json({ error: 'Error al cargar la música' });
    }

    const songs = musicData.songs;
    const albumId = req.params.album;

    console.log("Buscando canciones del album:", albumId);

    // Buscar las canciones del album
    const albumSongs = songs.filter(s => s.album.toLowerCase().trim() === albumId.toLowerCase().trim());

    for (let i = 0; i < albumSongs.length; i++) {
        console.log("Canción encontrada:", albumSongs[i]);
    }

    if (albumSongs.length > 0) {
        res.render('api', {
            song: null,
            artist: null,
            album: albumSongs
        });
    } else {
        console.log("Canciones no encontradas");
        res.render('api', {
            song: null,
            artist: [],
            album: []
        });
    }
}

module.exports = {
    eliminarCancion,
    eliminarAlbum,
    eliminarArtista,
    mostrarAlbum,
    intermediate,
    mostrarArtista,
    crearCancion,
    guardarCancion,
    mostrarCancion
}