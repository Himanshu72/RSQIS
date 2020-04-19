var mysql = require("mysql2/promise");
const config = require("../config");
const service = require("../service");
module.exports.login = async function (email) {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM users WHERE Email like "${email}" `
    );

    if (rows.length > 0) {
      connection.end();
      resolve(rows);
      c;
    } else {
      connection.end();
      reject();
    }
  });
};
module.exports.getAlloc = async function (id) {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM workallocated,road WHERE workallocated.roadID=road.roadID and workallocated.workerID='${id}' `
    );

    if (rows.length > 0) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};
