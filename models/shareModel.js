const db = require('../config/db');

class Share {
    // Otorgar acceso (crear un permiso)
    static grantAccess({ user_id, type, file_id }, callback) {
        const query = `
            INSERT INTO permission (user_id, type, FILE_idFILE)
            VALUES (?, ?, ?)
        `;
        db.query(query, [user_id, type, file_id], callback);
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