const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'juanreyes8',
    database: 'filedepot'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

module.exports = db;
