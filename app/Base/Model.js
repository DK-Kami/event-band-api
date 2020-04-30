const connectionString = require('../../utils/db');
const pg = require('pg');

class Model {
  constructor(tableName) {
    this.tableName = tableName;
  }

  getAll(callback) {
    this.connectToDB((err, client, done) => {
      if (err) {
        return callback(err, null);
      }

      client.query('SELECT * FROM $1', [this.tableName], (err, result) => {
        done();
        if (err) {
          return callback(err, null);
        }
        callback(null, result.rows);
      });
    });
  }

  connectToDB(callback) {
    pg.connect(connectionString, callback(err, client, done));
  }
};

module.exports = Model;