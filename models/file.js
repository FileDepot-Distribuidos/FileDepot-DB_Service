const db = require('../config/db');

class File {
    static create({ name, type, size, creation_date, last_modified, hash }, callback) {
        db.query(
            'INSERT INTO file (name, type, size, creation_date, last_modified, hash) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, size, creation_date, last_modified, hash],
            callback
        );
    }

    static delete(name, callback) {
        db.query('DELETE FROM file WHERE name = ?', [name], callback);
    }

    // Nuevo método para actualizar el nombre del archivo en la base de datos
    static updateName(oldFileName, newFileName, callback) {
        db.query(
            'UPDATE file SET name = ? WHERE name = ?',
            [newFileName, oldFileName],
            callback
        );
    }
}

module.exports = File;
