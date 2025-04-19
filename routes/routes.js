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
router.get('/file/byId/:id', fileController.getFileById);
router.get('/download/:fileId', fileController.downloadFile);

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
router.get('/directorio/id/:id', directoryController.getDirectoryById);
router.get('/directorio/path/:path', directoryController.getDirectoryByPath);


// Share
router.post('/shareFile', shareController.grantAccess);
router.post('/shareDirectory', shareController.grantAccessDir);
router.get('/shared/:id', shareController.getSharedFiles);
router.delete('/revoke', shareController.revokeAccess);
router.get('/permissions/:file_id', shareController.getFilePermissions);



module.exports = router;
