/** Common config for bookstore. */

require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "bookstore_test";
} else {
    DB_URI = process.env.DATABASE_URL || "bookstore";
}

module.exports = { DB_URI };