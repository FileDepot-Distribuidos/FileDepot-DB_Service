const db = require('../config/db');

const Node = {
    create: (data, callback) => {
        const query = 'INSERT INTO node (ipv4_address, total_size_bytes, available_size_bytes) VALUES (?, ?, ?)';
        const values = [data.ipv4_address, data.total_size, data.available_size];

        db.query(query, values, callback);
    },
    find : (query, callback) => {
        const sql = 'SELECT * FROM node';
        db.query(sql, query, callback);
    },
};

module.exports = Node;
