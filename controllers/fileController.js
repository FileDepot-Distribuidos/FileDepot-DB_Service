const { log } = require('console');
const File = require('../models/fileModel');

// Crear archivo
exports.uploadFile = (req, res) => {
    let { name, type, size, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY } = req.body;

    owner_id = parseInt(owner_id);
    NODE_idNODE = parseInt(NODE_idNODE);
    DIRECTORY_idDIRECTORY = parseInt(DIRECTORY_idDIRECTORY);

    console.log('👉 Datos recibidos en body:');
    console.log('  name:', name);
    console.log('  type:', type);
    console.log('  size:', size);
    console.log('  hash:', hash);
    console.log('  owner_id (parsed):', owner_id);
    console.log('  NODE_idNODE (parsed):', NODE_idNODE);
    console.log('  DIRECTORY_idDIRECTORY (parsed):', DIRECTORY_idDIRECTORY);

    const creation_date = new Date();
    const last_modified = creation_date;

    File.create(
        { name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY },
        (err) => {
            if (err) {
                console.error('Error al registrar el archivo en la base de datos:', err);
                return res.status(500).send(err);
            }

            console.log('Archivo registrado correctamente en la base de datos');
            res.send('Archivo registrado correctamente');
        }
    );
};

// Eliminar archivo por nombre
exports.deleteFile = (req, res) => {
    const { name } = req.params;

    File.delete(name, (err) => {
        if (err) {
            console.error('Error en DB:', err);
            return res.status(500).send(err);
        }

        console.log('Archivo eliminado de la base de datos:', name);
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

exports.getAllFiles = (req, res) => {
    const owner_id = parseInt(req.params.userId);

    File.getAll(owner_id, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los archivos', details: err });
        }
        res.json(files);
    });
};
