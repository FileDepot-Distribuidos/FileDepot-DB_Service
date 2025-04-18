const Share = require('../models/shareModel');

// Otorgar acceso a un archivo
exports.grantAccess = (req, res) => {

    const { sharedWithId, sharedFile } = req.body;

    if (!sharedWithId || !sharedFile) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    Share.grantAccess(sharedWithId, sharedFile, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Acceso otorgado correctamente');
    });
};

// Otorgar acceso a una carpeta (varios archivos)
exports.grantAccessDir = (req, res) => {

    const { sharedWithId, sharedDirectory } = req.body;

    if (!sharedWithId || !sharedDirectory) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    Share.grantAccessDir(sharedWithId, sharedDirectory, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Acceso otorgado correctamente');
    });
};

// Obtiene todos los archivos compartidos de un usuario
exports.getSharedFiles = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'No se recibio el ID del usuario' });
    }

    Share.getFiles(id, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los archivos compartidos', details: err });
        }
        res.json(files);
    });
};


// Revocar acceso a un archivo
exports.revokeAccess = (req, res) => {
    const { user_id, file_id } = req.body;
    console.log("Datos para revocar acceso:", req.body);

    if (!user_id || !file_id) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    Share.revokeAccess(user_id, file_id, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Acceso revocado correctamente');
    });
};

// Obtener permisos de un archivo
exports.getFilePermissions = (req, res) => {
    const { file_id } = req.params;

    console.log("ID del archivo para obtener permisos:", file_id);
    

    Share.getFilePermissions(file_id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};