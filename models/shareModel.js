const db = require('../config/db');

class Share {
    // Otorgar acceso (crear un permiso)
    static grantAccess(user_id, file_id, callback) {
        console.log("Datos para otorgar acceso:", user_id, file_id);

        const query = `
            INSERT INTO permission (user_id, type, FILE_idFILE)
            VALUES (?, 'LECTURA', ?)
        `;
        db.query(query, [user_id, file_id], callback);
    }

    // Otorgar acceso (crear un permiso)
    static grantAccessDir(user_id, idDIRECTORY, callback) {
        console.log("Datos para otorgar acceso:", user_id, idDIRECTORY);

        const getFilesQuery = `
                SELECT idFILE FROM file
                WHERE DIRECTORY_idDIRECTORY = ?
            `;
        db.query(getFilesQuery, [idDIRECTORY], (err, results) => {
            if (err) {
                return callback(err);
            }

            const fileIds = results.map(row => row.idFILE);
            if (fileIds.length === 0) {
                return callback(null, { message: 'No hay archivos en el directorio' });
            }

            const insertQuery = `
                    INSERT INTO permission (user_id, type, FILE_idFILE)
                    VALUES ${fileIds.map(() => '(?, "LECTURA", ?)').join(', ')}
                `;
            const insertValues = fileIds.flatMap(fileId => [user_id, fileId]);

            db.query(insertQuery, insertValues, callback);
        });
    }

    // Obtener archivos compartidos de un usuario
    static getFiles(user_id, callback) {

        const query = `
            SELECT f.*
            FROM file f
            INNER JOIN permission p ON f.idFILE = p.FILE_idFILE
            WHERE p.user_id = ?
        `;
        db.query(query, [user_id], callback);
    }

    // Revocar acceso (eliminar permiso)
    static revokeAccess(user_id, file_id, callback) {
        const query = `
            DELETE FROM permission
            WHERE user_id = ? AND FILE_idFILE = ?
        `;
        db.query(query, [user_id, file_id], callback);
    }

    // Obtener permisos de un archivo
    static getFilePermissions(file_id, callback) {
        const query = `
            SELECT * FROM permission
            WHERE FILE_idFILE = ?
        `;
        db.query(query, [file_id], callback);
    }

}

module.exports = Share;