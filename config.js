/** Common config for bookstore. */

require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const DB_URI = (process.env.NODE_ENV === "test")
  ? "bookstore_test"
  : "bookstore";

module.exports = { DB_URI, DB_USER, DB_PASS };