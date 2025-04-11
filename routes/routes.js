const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const nodeController = require('../controllers/nodeController');
const directoryController = require('../controllers/directoryController');
const shareController = require('../controllers/shareController');

// Ruta para manejar la subida de archivos
router.post('/upload', fileController.uploadFile);

// Ruta para eliminar archivos en el servidor
router.delete('/delete/:name', fileController.deleteFile);

router.put('/move', fileController.moveFile);

// Ruta para renombrar archivos
router.put('/rename', fileController.renameFile);

router.post('/node', nodeController.registerNode);

router.post('/directory', directoryController.createDirectory);

router.post('/share', shareController.grantAccess);
router.delete('/revoke', shareController.revokeAccess);
router.get('/permissions/:file_id', shareController.getFilePermissions);
router.get('/files', fileController.getAllFiles);


module.exports = router;
