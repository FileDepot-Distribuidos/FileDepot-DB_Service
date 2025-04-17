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
    const userId = req.params.userId;
    Directory.getAll( userId, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener directorios', details: err });
        res.json(results);
    });
};

exports.getByDirectory = (req, res) => {
    const owner_id = req.params.userId;
    const dir = req.params.dir;

    if (dir === '0') {
        return Directory.getRootDirectoryByUser(owner_id, (err, rootDir) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el directorio raíz', details: err });
            }
            const newDir = rootDir[0].idDIRECTORY;
            Directory.getByDir(owner_id, newDir, (err, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener los directorios', details: err });
                }
                res.json(files);
            });
        });
    }

    Directory.getByDir( owner_id, dir, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener directorios', details: err });
        res.json(results);
    });
};

exports.renameDirectory = (req, res) => {
    const { id, newPath } = req.body;

    // 1. Obtener el path actual
    Directory.getById(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: 'No se pudo obtener el path del directorio original' });
        }

        const oldPath = results[0].path;

        // 2. Renombrar el directorio principal
        Directory.rename(id, newPath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al renombrar directorio principal' });
            }

            // 3. Actualizar todos los hijos (paths descendientes)
            Directory.updatePathsRecursively(oldPath, newPath, (err2) => {
                if (err2) {
                    return res.status(500).json({ error: 'Error actualizando paths de subdirectorios' });
                }

                res.json({ message: 'Directorio y subdirectorios renombrados correctamente' });
            });
        });
    });
};

exports.moveDirectory = (req, res) => {
    const { id, newParentId, newFullPath } = req.body;

    Directory.move(id, newParentId, newFullPath, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al mover directorio', details: err });
        res.json({ message: 'Directorio movido correctamente' });
    });
};

exports.getDirectoryById = (req, res) => {
    const id = req.params.id;

    Directory.getById(id, (err, results) => {
        if (err) {
            console.error('Error consultando directorio por ID:', err);
            return res.status(500).json({ error: 'Error al consultar directorio' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Directorio no encontrado' });
        }

        res.json(results[0]);
    });
};

exports.getDirectoryByPath = (req, res) => {
    let path = decodeURIComponent(req.params.path); // 🔧 necesario
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    Directory.getByPath(path, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar por path' });
        if (results.length === 0) return res.status(404).json({ error: 'Directorio no encontrado' });
        res.json({ directoryId: results[0].idDIRECTORY });
    });
};


exports.deleteDirectory = (req, res) => {
    const id = req.params.id;

    Directory.deleteDirectoryRecursive(id, (err) => {
        if (err) {
            console.error("Error en eliminación recursiva:", err);
            return res.status(500).json({ error: 'Error al eliminar directorio de forma recursiva' });
        }
        res.json({ message: 'Directorio y contenido eliminado correctamente' });
    });
};


