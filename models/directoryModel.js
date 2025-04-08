const db = require('../config/db');

const Directory = {
    create: (path, creation_date, owner_id, parent_directory_id, callback) => {
        const query = `
            INSERT INTO directory (path, creation_date, owner_id, DIRECTORY_idDIRECTORY)
            VALUES (?, ?, ?, ?)
        `;
        db.query(query, [path, creation_date, owner_id, parent_directory_id], callback);
    }
};

module.exports = Directory;