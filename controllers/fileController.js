const { log } = require('console');
const File = require('../models/fileModel');

// Crear archivo
exports.uploadFile = (req, res) => {
    const { name, type, size, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY } = req.body;
    console.log("Datos recibidos:", req.body);
    
    const creation_date = new Date();
    const last_modified = creation_date;

    File.create({ name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY }, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo registrado correctamente');
    });
};

// Eliminar archivo por nombre
exports.deleteFile = (req, res) => {
    const { name } = req.params;
    File.delete(name, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo eliminado');
    });
};

// Renombrar archivo
exports.renameFile = (req, res) => {
    const { oldFileName, newFileName } = req.body;

    File.updateName(oldFileName, newFileName, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el nombre del archivo en la base de datos', details: err });
        }

        res.json({ message: 'Archivo renombrado correctamente', oldFileName, newFileName });
    });
};

// Mover archivo a otro directorio
exports.moveFile = (req, res) => {
    const { file_id, new_dir_id } = req.body;

    File.moveFile(file_id, new_dir_id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al mover el archivo', details: err });
    
        if (result.affectedRows === 0 || result.changedRows === 0) {
            return res.status(404).json({ 
                message: `No se encontró el archivo #'${file_id}' o ya estaba en ese directorio.` 
            });
        }
    
        res.json({ 
            message: `Archivo #'${file_id}' movido correctamente al directorio #${new_dir_id}.`,
            result
        });
    });
};

// Obtener todos los archivos
exports.getAllFiles = (req, res) => {
    File.getAll((err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los archivos', details: err });
        }
        res.json(files);
    });
};
