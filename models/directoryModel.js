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
}


module.exports = Directory;