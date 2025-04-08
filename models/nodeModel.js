const db = require('../config/db');

const Node = {
    create: (data, callback) => {
        const query = 'INSERT INTO node (ipv4_address, total_size, available_size) VALUES (?, ?, ?)';
        const values = [data.ipv4_address, data.total_size, data.available_size];

        db.query(query, values, callback);
    }
};

module.exports = Node;
