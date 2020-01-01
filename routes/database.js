var mysql = require("mysql2/promise");
var connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "rqis"
});

module.exports.getAllUser = async function() {
  // get the client
  const mysql = require("mysql2/promise");
  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "rqis"
  });
  // query database

  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute("SELECT * FROM `users`");
    if (rows != null) resolve(rows);
    else reject();
  });
};
