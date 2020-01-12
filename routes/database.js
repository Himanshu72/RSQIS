var mysql = require("mysql2/promise");
var nodemailer = require("nodemailer");
const config = require("../config");
const uuid = require("uuid/v1");

module.exports.getAllUser = async function() {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis1"
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute("SELECT * FROM `users`");
    if (rows != null) resolve(rows);
    else reject();
  });
};

module.exports.addUser = async function(data, type) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis1"
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
    if (rows != null) resolve(rows);
    else reject();
  });
};

module.exports.findUserById = async email => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis1"
  });

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` where `Email`='" + email + "';"
    );
    if (rows.length > 0) resolve(rows);
    else reject();
  });
};

module.exports.getRoad = () => {};

module.exports.sendEmail = (email, pass) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.pass
    }
  });

  var mailOptions = {
    from: "eventspot07@gmail.com",
    to: email,
    subject: "RSQIS:Forgot your Password",
    text: "your password is : " + pass
  };

  transporter.sendMail(mailOptions, function(error, info) {
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
    host: "localhost",
    user: "root",
    database: "rsqis1"
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
module.exports.getAllRoad = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis1"
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `road` WHERE Status='untouch'"
    );
    resolve(rows);
  });
};
