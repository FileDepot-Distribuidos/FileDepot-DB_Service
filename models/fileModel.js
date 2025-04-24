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

        db.query('DELETE FROM permission WHERE FILE_idFILE = ?', [id], (err) => {
            if (err) {
                return callback(err);
            }
            
            db.query('DELETE FROM file WHERE idFILE = ?', [id], callback);
        });

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
    
        const query = `
            SELECT f.*, d.path AS directory_path
            FROM file f
            JOIN directory d ON f.DIRECTORY_idDIRECTORY = d.idDIRECTORY
            WHERE f.idFILE = ?
        `;
    
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al consultar archivo en modelo con ID', id, ':', err);
                return callback(err, null);
            }
    
            if (results.length === 0) {
                console.warn(`No se encontró ningún archivo con ID: ${id}`);
                return callback(null, null);
            }
    
            console.log("Archivo encontrado en modelo con path:", results[0]);
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

    static getFiles(owner_id, DIRECTORY_idDIRECTORY, callback) {
        db.query('SELECT idFILE, name, type, size, creation_date, last_modified, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY FROM file WHERE owner_id = ? AND DIRECTORY_idDIRECTORY = ?',
            [owner_id, DIRECTORY_idDIRECTORY],
            callback);
    }
    //download file by id
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
