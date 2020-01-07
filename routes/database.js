var mysql = require("mysql2/promise");
var nodemailer = require("nodemailer");
const uuid = require("uuid/v1");

module.exports.getAllUser = async function() {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis"
  });
  // query database

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute("SELECT * FROM `users`");
    if (rows != null) resolve(rows);
    else reject();
  });
};

module.exports.addUser = async function(data) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rsqis"
  });

  const rows = await connection.execute(
    "INSERT INTO `users` (`userID`,`Email`, `Phone`, `Firstname`, `Lastname`, `Pasword`, `Timestamp`) VALUES ('" +
      uuid() +
      "','" +
      data.email +
      "', '" +
      data.ph +
      "', '" +
      data.fname +
      "', '" +
      data.lname +
      "', '" +
      data.pass +
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
    database: "rsqis"
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` where `Email`='" + email + "';"
    );
    if (rows.length > 0) resolve(rows);
    else reject();
  });
};

module.exports.sendEmail = (email, pass) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eventspot07@gmail.com",
      pass: "h4ck3d321"
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
