const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Arango22',
    database: 'mydb'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

module.exports = db;
