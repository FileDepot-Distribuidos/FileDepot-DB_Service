const db = require('../config/db');

class File {
    static create({ name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY }, callback) {
        db.query(
            'INSERT INTO file (name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY],
            callback
        );
    }

    static delete(name, callback) {
        db.query('DELETE FROM file WHERE name = ?', [name], callback);
    }

    static updateName(oldFileName, newFileName, callback) {
        db.query(
            'UPDATE file SET name = ? WHERE name = ?',
            [newFileName, oldFileName],
            callback
        );
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

  static getFileLocationById(fileID, callback) {
    const query = `
        SELECT 
            f.idFILE AS file_id,
            f.name AS file_name,
            d.path AS directory_path,
            n.idNODE AS node_id,
            n.ipv4_address AS node_ip
        FROM 
            FILE f
        JOIN 
            DIRECTORY d ON f.DIRECTORY_idDIRECTORY = d.idDIRECTORY
        JOIN 
            NODE n ON f.NODE_idNODE = n.idNODE
        WHERE 
            f.idFILE = ?
    `;

    db.query(query, [fileID], callback);
}

}

module.exports = File;
