var database = require("./routes/database");
var config = require("./config");
const Cryptr = require("cryptr");
const csv = require("csv-parser");
const fs = require("fs");

const cryptr = new Cryptr(config.secret);

module.exports = {
  auth: function(user, pass) {
    return new Promise((resolve, reject) => {
      const users = database.getAllUser();
      users.then(rows => {
        rows.forEach(element => {
          if (
            user == element.Email &&
            pass == cryptr.decrypt(element.Pasword)
          ) {
            console.log("Session created");

            resolve(element.userID);
          }
        });

        reject();
      });
    });
  },
  createSalt: function(text) {
    const encryptedString = cryptr.encrypt(text);
    return encryptedString;
  },
  undoSalt: function(salt) {
    const decryptedString = cryptr.decrypt(salt);
    return decryptedString;
  },
  readCSV: function(file) {
    fs.createReadStream("./data/" + file)
      .pipe(csv())
      .on("data", row => {
        // console.log(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
  }
};
