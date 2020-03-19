var express = require("express");
var router = express.Router();
var database = require("./database");
var android = require("./android");
var service = require("../service");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  let del = database.deleteWorkerByID(id);
  del.then(() => {
    res.send({ msg: "user deleted", op: true });
  });
});

router.post("/login", (req, res) => {
  let user = android.login(req.body.email, req.body.password);
  user
    .then(result => {
      if (service.undoSalt(result[0].Pasword) === req.body.password) {
        result[0].Pasword = req.body.password;
        if (result[0].role == "admin") {
          res.json({
            status: 400,
            msg: "invalid password"
          });
        }
        res.json(result[0]);
      } else {
        res.json({
          status: 400,
          msg: "invalid password"
        });
      }
    })
    .catch(e => {
      console.log(e);
      res.json({ msg: "user not found", status: 404 });
    });
});

router.post("/register", (req, res) => {
  req.body.pass = service.createSalt(req.body.pass);
  user = database.addUser(req.body, "public");
  user
    .then(() => {
      res.json({ status: 200, msg: "user registerd sucessfully" });
    })
    .catch(e => {
      console.log(e);
      if ((e.errno = 1062)) {
        res.json({ status: 400, msg: "user already exsist" });
      } else {
        res.json({ status: 400, msg: e.message });
      }
    });
});

module.exports = router;
