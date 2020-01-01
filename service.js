var database = require("./routes/database");

module.exports = {
  auth: function(user, pass) {
    return new Promise((resolve, reject) => {
      const users = database.getAllUser();
      users.then(rows => {
        rows.forEach(element => {
          console.log(element);
          if (
            user == element.user_name &&
            pass == element.password &&
            element.role == "admin"
          ) {
            console.log("Session created");
            resolve(true);
          }
        });
        reject();
      });
    });
  }
};
