var database = require("./routes/database");
var config = require("./config");
const Cryptr = require("cryptr");
const csv = require("csv-parser");
const fs = require("fs");
const hbjs = require("handbrake-js");
const cryptr = new Cryptr(config.secret);

module.exports = {
  auth: function (user, pass) {
    return new Promise((resolve, reject) => {
      const users = database.getAllUser();
      users.then((rows) => {
        rows.forEach((element) => {
          if (
            user == element.Email &&
            pass == cryptr.decrypt(element.Pasword) &&
            element.role == "admin"
          ) {
            console.log("Session created");

            resolve(element.userID);
          }
        });

        reject();
      });
    });
  },
  createSalt: function (text) {
    const encryptedString = cryptr.encrypt(text);
    return encryptedString;
  },
  undoSalt: function (salt) {
    const decryptedString = cryptr.decrypt(salt);
    return decryptedString;
  },
  readCSV: function (file) {
    let data = [];
    fs.createReadStream("./data/" + file)
      .pipe(csv())
      .on("data", (row) => {
        data.push(1);
        console.log(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        return data;
      });
  },
  h264Tomp4: function (file) {
    hbjs
      .spawn({ input: file, output: file + ".mp4" })
      .on("error", (err) => {
        console.log(err);
      })
      .on("progress", (progress) => {});
  },
};

module.exports.getCords = function (path) {
  return new Promise((resolve, reject) => {
    let data = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        data.push({
          lat: row.Latitude,
          long: row.Longitude,
        });
        //   console.log(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");

        resolve(data);
      });
  });
};
