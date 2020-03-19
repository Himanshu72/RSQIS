var mysql = require("mysql2/promise");
const config = require("../config");
const service = require("../service");
module.exports.login = async function(email) {
  // get the client

  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "rsqis1"
  });
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM users WHERE Email like "${email}" `
    );
    if (rows.length > 0) resolve(rows);
    else reject();
  });
};
