
const express = require('express');
const apicontroller = require('../controllers/apicontroller.js');

const router = express.Router();

router.get('/crear', apicontroller.crearCancion);
router.post('/crear', apicontroller.guardarCancion);
router.get('/cancion/:song', apicontroller.mostrarCancion);
router.post('/intermediate', apicontroller.intermediate);
router.get('/artista/:artist', apicontroller.mostrarArtista);
router.get('/album/:album', apicontroller.mostrarAlbum);
router.get('/eliminar/cancion/:song', apicontroller.eliminarCancion);
router.get('/eliminar/album/:album', apicontroller.eliminarAlbum);
router.get('/eliminar/artista/:artist', apicontroller.eliminarArtista);

module.exports = router;
