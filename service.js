var database = require("./routes/database");

module.exports = {
  auth: function(user, pass) {
    return new Promise((resolve, reject) => {
      const users = database.getAllUser();
      users.then(rows => {
        rows.forEach(element => {
          if (user == element.Email && pass == element.Pasword) {
            console.log("Session created");
            resolve(element.userID);
          }
        });

        reject();
      });
    });
  }
};
