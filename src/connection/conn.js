require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 1000,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.NODE_ENV === "test" ? process.env.MYSQL_DATABASE_TEST : process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
});

exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result, fields) => {
      if (error) {
        reject(error);
      }
      if (resolve) {
        resolve(result);
      }
    });
  })
};