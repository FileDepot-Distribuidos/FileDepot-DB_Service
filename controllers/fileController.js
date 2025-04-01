const fs = require('fs');
const path = require('path');
const File = require('../models/file');

exports.uploadFile = (req, res) => {
    const { originalname, mimetype, size } = req.file;
    const creation_date = new Date();
    const last_modified = creation_date;
    const hash = req.body.hash; 

    File.create({ name: originalname, type: mimetype, size, creation_date, last_modified: last_modified, hash }, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo subido correctamente');
    });
};

exports.deleteFile = (req, res) => {
    const { name } = req.params; 
    File.delete(name, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo eliminado');
    });
};

exports.renameFile = (req, res) => {
    const { oldFileName, newFileName } = req.body;

    // Definir las rutas completas para los archivos
    const oldPath = path.join(__dirname, '..', 'uploads', oldFileName);
    const newPath = path.join(__dirname, '..', 'uploads', newFileName);

    // Verificar si el archivo original existe
    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ error: 'El archivo original no existe' });
    }

    // Renombrar el archivo
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al renombrar el archivo', details: err });
        }

        // Actualizar el nombre del archivo en la base de datos
        File.updateName(oldFileName, newFileName, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el nombre del archivo en la base de datos', details: err });
            }

            res.json({ message: 'Archivo renombrado correctamente', oldFileName, newFileName });
        });
    });
};
