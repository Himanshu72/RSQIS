var express = require("express");
var router = express.Router();
var auth = require("../service");
var database = require("./database");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "rqis"
});

router.get("/", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.user + "/filter_road");
  } else {
    res.render("login", { data: { user: false } });
  }
});

/* POST login page. */
router.post("/login", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.user + "/filter_road", {
      data: { user: true }
    });
  } else {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      auth
        .auth(username, password)
        .then(result => {
          req.session.user = username;
          res.status(200).redirect("/" + req.body.username + "/filter_road");
        })
        .catch(() => {
          res.status(404).render("login", {
            data: {
              error: true,
              msg: "Invalid Username or Password",
              user: false
            }
          });
        });

      // let valide = auth.auth(username, password);

      // valide.then(msg => {
      //   console.log(msg);
      // });
    } else {
      res.status(404).render("login", {
        data: {
          error: true,
          msg: "Username or Password must not be empty",
          user: false
        }
      });
    }
  }
});

/* GET register page. */
router.get("/register", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.user + "/filter_road");
  } else {
    res.render("register", { data: { user: false } });
  }
});

/* GET road gallary page. */
router.get("/forgot", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.user + "/filter_road");
  } else {
    res.render("forgot", { data: { user: false } });
  }
});

/* GET road gallary page. */
router.get("/:user/filter_road", function(req, res, next) {
  if (req.session.user) {
    res.render("road_gallary", {
      data: { user: true, username: req.session.user }
    });
  } else {
    res.redirect("/");
  }
});

/* GET road page. */
router.get("/:user/road/:id", function(req, res, next) {
  if (req.session.user) {
    res.render("road", { data: { user: true, username: req.session.user } });
  } else {
    res.redirect("/");
  }
});

/* GET road complaint page. */
router.get("/:user/complaint_list", function(req, res, next) {
  if (req.session.user) {
    res.render("road", { data: { user: true }, username: req.session.user });
  } else {
    res.redirect("/");
  }
});

/* GET road complaint page. */
router.get("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    // cannot access session here
    console.log(err);
  });
  res.redirect("/");
});

module.exports = router;
