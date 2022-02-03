const mysql = require("mysql");
require("dotenv").config();

let config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  connectionLimit: 10,
};

var pool = mysql.createPool(config);

let connectionFunctions = {
  /**
   *Connects to the database.
   * @param {*} err - Possible error
   */
  connect: (err) => {
    if (err) {
      console.log(err);
    } else {
      pool.connect();
    }
  },
  /**
   * Closes connection to the database.
   * @param {*} err - Possible error
   */
  close: (err) => {
    if (err) {
      console.log(err);
    } else {
      pool.end();
    }
  },
  /**
   * Sends a query to database.
   * @returns Possible error or all rows in the database.
   */
  findAll: () =>
    new Promise((resolve, reject) => {
      pool.query("SELECT * FROM contacts", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),

  /**
   * Sends a query to database.
   * @param {*} id - Id to be searched from the database.
   * @returns Possible error or a row with a matching id.
   */
  findById: (id) =>
    new Promise((resolve, reject) => {
      pool.query("SELECT * FROM contacts WHERE id = " + id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),

  /**
   * Deletes a row from database.
   * @param {*} id - Id to be deleted from the database.
   * @returns Possible error or success message.
   */
  deleteById: (id) =>
    new Promise((resolve, reject) => {
      pool.query("DELETE FROM contacts WHERE id = " + id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),

  /**
   * Saves new row to database.
   * @param {*} newItem - Item to be saved to the database.
   * @returns Possible error or success message.
   */
  save: (newItem) =>
    new Promise((resolve, reject) => {
      pool.query("INSERT INTO contacts SET ?", newItem, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),
};

module.exports = connectionFunctions;
