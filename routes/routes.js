const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const nodeController = require('../controllers/nodeController');
const directoryController = require('../controllers/directoryController');
const shareController = require('../controllers/shareController');

// Files
router.post('/upload', fileController.uploadFile);
router.get('/files/:userId', fileController.getAllFiles);
router.delete('/delete/:name', fileController.deleteFile);
router.put('/move', fileController.moveFile);
router.put('/rename', fileController.renameFile);

// Nodos
router.post('/node', nodeController.registerNode);

// Directorios
router.post('/directory', directoryController.createDirectory);
router.get('/directory/root/:userId', directoryController.getRootDirectory);
router.get('/directory/obtener', directoryController.getAllDirectory);

// Share
router.post('/share', shareController.grantAccess);
router.delete('/revoke', shareController.revokeAccess);
router.get('/permissions/:file_id', shareController.getFilePermissions);



module.exports = router;
