var mysql = require("mysql2/promise");
const config = require("../config");
const service = require("../service");
const uuid = require("uuid/v1");

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

module.exports.addProof = async function (obj) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  const rows = await connection.execute(
    "INSERT INTO `proof`(`proofID`, `workID`, `description`, `path`) VALUES ('" +
      uuid() +
      "','" +
      obj.workID +
      "','" +
      obj.desc +
      "','" +
      obj.path +
      "')"
  );
  // console.log(rows);
  return new Promise(async (resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.addFeed = async function (obj) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  const rows = await connection.execute(
    "INSERT INTO `feedback`(`feedID`, `publicID`, `issue`, `address`, `lat`, `lng`, `path`) VALUES ('" +
      uuid() +
      "','" +
      obj.pubID +
      "','" +
      obj.issue +
      "','" +
      obj.add +
      "','" +
      obj.lat +
      "','" +
      obj.lng +
      "','" +
      obj.path +
      "')"
  );
  // console.log(rows);
  return new Promise(async (resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};
