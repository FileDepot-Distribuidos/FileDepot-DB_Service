const Share = require('../models/shareModel');

// Otorgar acceso a un archivo
exports.grantAccess = (req, res) => {
    const { user_id, type, file_id } = req.body;
    console.log("Datos para otorgar acceso:", req.body);

    if (!user_id || !type || !file_id) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    Share.grantAccess({ user_id, type, file_id }, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Acceso otorgado correctamente');
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