const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const nodeController = require('../controllers/nodeController');
const directoryController = require('../controllers/directoryController');
const shareController = require('../controllers/shareController');

// Files
router.post('/upload', fileController.uploadFile);
router.get('/files/:userId', fileController.getAllFiles);
router.get('/files/:userId/:dir', fileController.getFiles);
router.delete('/delete/:id', fileController.deleteFile);
router.put('/move', fileController.moveFile);
router.put('/rename', fileController.renameFile);
router.get('/files/byId/:id', fileController.getFileById);

// Nodos
router.post('/node', nodeController.registerNode);

// Directorios
router.post('/directory', directoryController.createDirectory);
router.get('/directory/root/:userId', directoryController.getRootDirectory);
router.get('/directory/:userId', directoryController.getAllDirectory);
router.get('/directory/:userId/:dir', directoryController.getByDirectory);
router.put('/directory/rename', directoryController.renameDirectory);
router.put('/directory/move', directoryController.moveDirectory);
router.delete('/directory/delete/:id', directoryController.deleteDirectory);
router.get('/directory/by-id/:id', directoryController.getDirectoryById);
router.get('/directory/by-path/:path', directoryController.getDirectoryByPath);


// Share
router.post('/share', shareController.grantAccess);
router.delete('/revoke', shareController.revokeAccess);
router.get('/permissions/:file_id', shareController.getFilePermissions);



module.exports = router;
