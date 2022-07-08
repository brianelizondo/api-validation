/** Database config for database. */
const { Client } = require("pg");
const { DB_URI, DB_USER, DB_PASS } = require("./config");

const db = new Client({
    user: DB_USER,
    password: DB_PASS,
    database: DB_URI
});

db.connect();

module.exports = db;