const db = require('../config/db');

class Directory {
    static create(path, creation_date, owner_id, parent_directory_id, callback) {
        console.log("Datos recibidos para crear directorio:", { path, creation_date, owner_id, parent_directory_id });

        const query = `
            INSERT INTO directory (path, creation_date, owner_id, DIRECTORY_idDIRECTORY)
            VALUES (?, ?, ?, ?)
        `;
        db.query(query, [path, creation_date, owner_id, parent_directory_id], callback);
    }
    
    static getRootDirectoryByUser(userId, callback) {
        const query = `
            SELECT idDIRECTORY FROM directory
            WHERE owner_id = ? AND DIRECTORY_idDIRECTORY IS NULL
            LIMIT 1
        `;
        db.query(query, [userId], callback);
    }

    static getAll(callback) {
        db.query('SELECT * FROM directory', callback); 
    }

    static rename(id, newPath, callback) {
        const query = `
            UPDATE directory SET path = ? WHERE idDIRECTORY = ?
        `;
        db.query(query, [newPath, id], callback);
    }

    static move(id, newParentId, newFullPath, callback) {
        const query = `
            UPDATE directory SET DIRECTORY_idDIRECTORY = ?, path = ?
            WHERE idDIRECTORY = ?
        `;
        db.query(query, [newParentId, newFullPath, id], callback);
    }

    static deleteOnlyDirectory(id, callback) {
        const query = `
            DELETE FROM directory WHERE idDIRECTORY = ?
        `;
        db.query(query, [id], callback);
    }

    static getById(id, callback) {
        const query = `
            SELECT * FROM directory WHERE idDIRECTORY = ?
        `;
        db.query(query, [id], callback);
    }

    // Para eliminar lo que hay dentro de la carpeta
    static getFilesInDirectory(directoryId, callback) {
        const query = `
            SELECT idFILE FROM file WHERE DIRECTORY_idDIRECTORY = ?
        `;
        db.query(query, [directoryId], callback);
    }

    static getSubdirectories(parentId, callback) {
        const query = `
            SELECT idDIRECTORY FROM directory WHERE DIRECTORY_idDIRECTORY = ?
        `;
        db.query(query, [parentId], callback);
    }

    static deleteDirectoryById(id, callback) {
        const query = `
            DELETE FROM directory WHERE idDIRECTORY = ?
        `;
        db.query(query, [id], callback);
    }
    
    static getByPath(path, callback) {
        const query = `SELECT idDIRECTORY FROM directory WHERE path = ?`;
        db.query(query, [path], callback);
    }

    static deleteFilesByDirectoryId(directoryId, callback) {
        const query = `
            DELETE FROM file WHERE DIRECTORY_idDIRECTORY = ?
        `;
        db.query(query, [directoryId], callback);
    }

    static updatePathsRecursively(oldPrefix, newPrefix, callback) {
        const query = `
            UPDATE directory
            SET path = REPLACE(path, ?, ?)
            WHERE path LIKE ?
        `;
        const likePattern = oldPrefix + '/%';
        db.query(query, [oldPrefix, newPrefix, likePattern], callback);
    }


    // Borrado recursivo completo
    static deleteDirectoryRecursive(id, callback) {
        this.getSubdirectories(id, (err, subdirs) => {
            if (err) return callback(err);

            // Primero eliminar subdirectorios 
            const deleteNext = (index) => {
                if (index >= subdirs.length) {
                    // Luego borrar archivos 
                    this.deleteFilesByDirectoryId(id, (err) => {
                        if (err) return callback(err);

                        // Borrar el propio directorio
                        this.deleteDirectoryById(id, callback);
                    });
                    return;
                }

                this.deleteDirectoryRecursive(subdirs[index].idDIRECTORY, (err) => {
                    if (err) return callback(err);
                    deleteNext(index + 1);
                });
            };

            deleteNext(0);
        });
    }
}


module.exports = Directory;