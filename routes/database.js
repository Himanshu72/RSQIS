var mysql = require("mysql2/promise");
var nodemailer = require("nodemailer");
const config = require("../config");
const uuid = require("uuid/v1");

module.exports.getAllWorker = async function () {
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
      "SELECT * FROM `users` where role='worker'"
    );
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.getAllUser = async function () {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "rsqis1",
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute("SELECT * FROM `users`");
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.addUser = async function (data, type) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  const rows = await connection.execute(
    "INSERT INTO `users` (`userID`, `Email`, `Phone`, `Firstname`, `Lastname`, `Pasword`, `role`, `Timestamp`) VALUES ('" +
      uuid() +
      "+`', '" +
      data.email +
      "', '" +
      data.ph +
      "', '" +
      data.fname +
      "', '" +
      data.lname +
      "', '" +
      data.pass +
      "','" +
      type +
      "', current_timestamp());"
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

module.exports.getUserById = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` where `userID`='" + id + "';"
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

module.exports.findUserById = async (email) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` where `Email`='" + email + "';"
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

module.exports.getRoadById = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `road` where `roadID`='" + id + "';"
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

module.exports.sendEmail = (email, pass) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.pass,
    },
  });

  var mailOptions = {
    from: "eventspot07@gmail.com",
    to: email,
    subject: "RSQIS:Forgot your Password",
    text: "your password is : " + pass,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    console.log("email:" + email);
    console.log("passwoard:" + pass);
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports.addRoad = async (roadname, userID, filename) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  const [rows, fields] = await connection.execute(
    "INSERT INTO `road`(`roadID`, `roadName`, `admin`, `filePath`) VALUES ('" +
      uuid() +
      "','" +
      roadname +
      "','" +
      userID +
      "','" +
      filename +
      "');"
  );
};

module.exports.getAllFilterdRoad = async () => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `road` WHERE Status='filtered'"
    );
    connection.end();
    resolve(rows);
  });
};

module.exports.getAllRoad = async (type) => {
  if (type == undefined) {
    type = "untouch";
  }

  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  if (type == "all") {
    return new Promise(async (resolve, reject) => {
      const [rows, fields] = await connection.execute("SELECT * FROM `road`");
      connection.end();
      resolve(rows);
    });
  }
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `road` WHERE Status='" + type + "'"
    );
    connection.end();
    resolve(rows);
  });
};
module.exports.deleteWorkerByID = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "DELETE FROM `users` WHERE `users`.`userID` = '" + id + "'"
    );
    connection.end();
    resolve(rows);
  });
};

module.exports.filterRoad = async function (id) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  const [rows, fields] = await connection.execute(
    "UPDATE `road` SET `Status` = 'filtered' WHERE `road`.`roadID` = '" +
      id +
      "';"
  );

  return new Promise((resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.completedRoad = async function (id) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  const [rows, fields] = await connection.execute(
    "UPDATE `road` SET `Status` = 'completed' WHERE `road`.`roadID` = '" +
      id +
      "';"
  );

  return new Promise((resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.allcateWork = async function (
  workerID,
  adminID,
  roadID,
  description
) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  const [rows, fields] = await connection.execute(
    "INSERT INTO `workallocated`(`allocateID`, `workerID`, `adminID`, `roadID`, `description`) VALUES ('" +
      uuid() +
      "','" +
      workerID +
      "','" +
      adminID +
      "','" +
      roadID +
      "','" +
      description +
      "')"
  );
  return new Promise((resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.deleteAlloc = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  const [rows, fields] = await connection.execute(
    "DELETE FROM `workallocated` WHERE `workallocated`.`allocateID` = '" +
      id +
      "'"
  );
  return new Promise((resolve, reject) => {
    if (rows != null) {
      connection.end();
      resolve(rows);
    } else {
      connection.end();
      reject();
    }
  });
};

module.exports.getAllAlocation = async () => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `workallocated`"
    );
    connection.end();
    resolve(rows);
  });
};

module.exports.getRoad = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `road` where  roadID='" + id + "'"
    );
    connection.end();
    resolve(rows);
  });
};

module.exports.getProof = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `proof`,`users` where  proof.workID=users.userID  AND roadID='" +
        id +
        "' ORDER BY proof.Timestamp DESC"
    );
    connection.end();
    console.log(rows);
    if (rows.length > 0) resolve(rows);
    else reject();
  });
};

module.exports.getComp = async function () {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `feedback`, `users` where users.userID=feedback.publicID ORDER BY feedback.timestamp DESC"
    );
    connection.end();
    console.log(rows);
    if (rows.length > 0) resolve(rows);
    else reject();
  });
};

module.exports.deleteComp = async (id) => {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.DBuser,
    password: config.DBpass,
    database: config.DBname,
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "DELETE FROM `feedback` WHERE feedID='" + id + "'"
    );
    connection.end();
    resolve(rows);
  });
};
