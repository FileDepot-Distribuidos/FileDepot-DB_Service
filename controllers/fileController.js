const { log } = require('console');
const File = require('../models/fileModel');
const Directory = require('../models/directoryModel');

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
        (err, result) => {
            if (err) {
                console.error('Error al registrar el archivo en la base de datos:', err);
                return res.status(500).send(err);
            }

            const insertedId = result.insertId;
            console.log('Archivo registrado con ID:', insertedId);
            res.status(201).json({
                message: 'Archivo registrado correctamente',
                id: insertedId
            });
        }
    );
};


// Eliminar archivo por ID
exports.deleteFile = (req, res) => {
    const { id } = req.params;
    console.log("ID recibido para eliminar:", req.params.id);


    File.delete(id, (err) => {
        if (err) {
            console.error('Error al eliminar archivo en la base de datos:', err);
            return res.status(500).send(err);
        }

        console.log('Archivo eliminado de la base de datos, ID:', id);
        res.send(`Archivo con ID ${id} eliminado correctamente`);
    });
};

exports.getFileById = (req, res) => {
    const { id } = req.params;

    
    File.getById(id, (err, file) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar archivo' });
        }

        if (!file) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        res.json(file);
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

exports.getFiles = (req, res) => {
    const owner_id = parseInt(req.params.userId);
    const dir = req.params.dir;

    if (dir === '0') {
        return Directory.getRootDirectoryByUser(owner_id, (err, rootDir) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el directorio raíz', details: err });
            }
            const newDir = rootDir[0].idDIRECTORY;
            File.getFiles(owner_id, newDir, (err, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener los archivos', details: err });
                }
                res.json(files);
            });
        });
    }

    File.getFiles(owner_id, dir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los archivos', details: err });
        }
        res.json(files);
    });
};