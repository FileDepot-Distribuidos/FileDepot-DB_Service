const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Ruta para manejar la subida de archivos
router.post('/upload', fileController.uploadFile);

// Ruta para eliminar archivos en el servidor
router.delete('/delete/:name', fileController.deleteFile);

// Ruta para renombrar archivos
router.put('/rename', fileController.renameFile);


module.exports = router;
