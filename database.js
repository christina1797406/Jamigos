const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'letsjam',
  database: 'jamigos'
});

module.exports = pool;
