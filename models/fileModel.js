const db = require('../config/db');

class File {
    static create({ name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY }, callback) {
        db.query(
            'INSERT INTO file (name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY],
            callback
        );
    }

    static delete(id, callback) {
        db.query('DELETE FROM file WHERE idFILE = ?', [id], callback);
    }
    

    static updateName(oldFileName, newFileName, callback) {
        db.query(
            'UPDATE file SET name = ? WHERE name = ?',
            [newFileName, oldFileName],
            callback
        );
    }

    static getById(id, callback) {
        console.log("Buscando archivo en modelo con ID:", id);

        const query = 'SELECT * FROM file WHERE idFILE = ?';

        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al consultar archivo en modelo con ID', id, ':', err);
                return callback(err, null);
            }

            if (results.length === 0) {
                console.warn(`No se encontró ningún archivo con ID: ${id}`);
                return callback(null, null);
            }

            console.log("Archivo encontrado en modelo:", results[0]);
            callback(null, results[0]);
        });
    }

    static moveFile(id_file, new_dir_id, callback) {
        db.query(
            'UPDATE file SET DIRECTORY_idDIRECTORY = ? WHERE idFILE = ?',
            [new_dir_id, id_file],
            callback
        );
    }

    static getAll(owner_id, callback) {
        db.query('SELECT idFILE, name, type, size, creation_date, last_modified, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY FROM file WHERE owner_id = ?',
            [owner_id],
            callback);
    }
}

module.exports = File;
