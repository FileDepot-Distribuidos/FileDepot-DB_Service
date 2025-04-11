const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const nodeController = require('../controllers/nodeController');
const directoryController = require('../controllers/directoryController');

// Ruta para manejar la subida de archivos
router.post('/upload', fileController.uploadFile);

// Ruta para eliminar archivos en el servidor
router.delete('/delete/:name', fileController.deleteFile);

// Ruta para renombrar archivos
router.put('/rename', fileController.renameFile);

router.post('/node', nodeController.registerNode);

router.post('/directory', directoryController.createDirectory);
router.get('/directory/root/:userId', directoryController.getRootDirectory);
router.get('/directory/obtener', directoryController.getAllDirectory);



module.exports = router;
