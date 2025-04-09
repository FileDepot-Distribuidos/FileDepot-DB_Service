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
