const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "aiflow",
});

module.exports = pool;