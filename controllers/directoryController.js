const Directory = require('../models/directoryModel');

exports.createDirectory = (req, res) => {
    const { path, creation_date, owner_id, parent_directory_id } = req.body;

    console.log("Datos recibidos para crear directorio:", req.body);

    Directory.create(path, creation_date, owner_id, parent_directory_id, (err, result) => {
        if (err) {
            console.error('Error al crear directorio:', err);
            return res.status(500).json({ error: 'Error al crear directorio' });
        }
        res.status(201).json({ message: 'Directorio creado exitosamente', id: result.insertId });
    });
};

exports.getRootDirectory = (req, res) => {
    const userId = req.params.userId;

    Directory.getRootDirectoryByUser(userId, (err, results) => {
        if (err) {
            console.error('Error consultando directorio raíz:', err);
            return res.status(500).json({ error: 'Error al consultar directorio' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontró directorio raíz para este usuario' });
        }

        res.json({ directoryId: results[0].idDIRECTORY });
    });
};

exports.getAllDirectory = (req, res) => {
    Directory.getAll((err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener directorios', details: err });
        res.json(results);
    });
};
