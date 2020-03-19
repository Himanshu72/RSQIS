var express = require("express");
var router = express.Router();
var auth = require("../service");
var database = require("./database");
const { Validator } = require("node-input-validator");

const fs = require("fs");
const csv = require("csv-parser");

router.post("/addRoad", (req, res, next) => {
  let roadname;

  if (req.session.user) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on("field", function(
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      roadname = val;
    });
    let csvfile;
    req.busboy.on("file", function(fieldname, file, filename) {
      console.log("Uploading: " + filename);
      vid = false;
      vidname = "";
      if (filename) name = filename;

      if (name.substring(name.length - 3, name.length) == "csv") {
        csvfile = name;
        vid - false;
      } else {
        vid = true;
        vidname = name;
      }
      fstream = fs.createWriteStream("./" + "/public/data/" + name);
      file.pipe(fstream);
      fstream.on("close", function() {
        if (vid) {
          auth.h264Tomp4("./public/data/" + vidname);
        }
        //auth.readCSV(name);
      });
    });
    req.busboy.on("finish", function() {
      console.log(
        `Roadname:${name} admin: ${req.session.id} filename: ${csvfile} `
      );
      database.addRoad(roadname, req.session.userID, csvfile);
      res.render("addRoad", {
        data: {
          msg: "Successfully Updated",
          user: true,
          username: req.session.user
        }
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.userID + "/road");
  } else {
    res.render("login", { data: { user: false } });
  }
});
/*POST register page*/
router.get("/addRoad", (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.render("addRoad", { data: { user: true, username: req.session.user } });
  } else {
    res.redirect("/");
  }
});
router.post("/register", function(req, res) {
  const v = new Validator(req.body, {
    email: "required|email|maxLength:50",
    fname: "required|maxLength:20",
    lname: "required|maxLength:20",
    pass: "required",
    cpass: "required",
    ph: "required|minLength:10|maxLength:10"
  });

  v.check().then(matched => {
    if (!matched) {
      console.log(v.errors);

      res.status(422).render("register", { data: { error: v.errors } });
    } else {
      if (req.body.pass == req.body.cpass) {
        req.body.pass = auth.createSalt(req.body.pass);
        const users = database.addUser(req.body, "admin");
        users
          .then(function(rows) {
            res.status(200).redirect("/");
          })
          .catch(e => {
            console.log(e);
            res
              .status(422)
              .render("register", { data: { error: "some thing went wrong" } });
          });
      } else {
        res.status(422).render("register", { data: { error: "pass!=cpass" } });
      }
    }
  });
  //res.redirect("/");
});

/* POST login page. */
router.post("/login", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.user + "/road", {
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
          console.log(result);
          req.session.userID = result;

          res.status(200).redirect("/" + req.session.userID + "/road");
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
    res.redirect("/" + req.session.userID + "/road");
  } else {
    res.render("register", { data: { user: false, route: "/register" } });
  }
});

// POST forgot
router.post("/forgot", (req, res) => {
  const v = new Validator(req.body, {
    email: "required|email|maxLength:50"
  });

  v.check().then(matched => {
    if (!matched) {
      res.redirect("/forgot");
    } else {
      user = database.findUserById(req.body.email);
      user
        .then(result => {
          database.sendEmail(result[0].Email, auth.undoSalt(result[0].Pasword));
          res.redirect("/");
        })
        .catch(() => {
          res.redirect("/forgot");
        });
    }
  });
  //res.redirect("/");
});

/* GET road gallary pag e. */
router.get("/forgot", function(req, res, next) {
  if (req.session.user) {
    res.redirect("/" + req.session.id + "/road");
  } else {
    res.render("forgot", { data: { user: false } });
  }
});

router.post("/sort", (req, res) => {
  res.redirect(`/${req.session.userID}/road?sort=${req.body.sort}`);
});

/* GET road gallary page. */
router.get("/:user/road", function(req, res, next) {
  if (req.session.user) {
    if (req.params.user != req.session.userID) {
      res.redirect("/" + req.session.userID + "/road");
    }

    let type = req.query.sort;
    let roads = database.getAllRoad(type);
    roads.then(result => {
      res.render("road_gallary", {
        data: {
          user: true,
          username: req.session.user,
          roads: result,
          type: type
        }
      });
    });
  } else {
    res.redirect("/");
  }
});

/* GET road page. */
router.get("/:user/road/:id", function(req, res, next) {
  if (req.session.user) {
    if (req.session.userID != req.params.user) {
      res.redirect("/" + req.session.userID + "/road/" + req.params.id);
    }
    const roads = database.getAllRoad("all");
    let currentRoad;
    roads.then(result => {
      let flag = true;
      for (let road of result) {
        if (road.roadID == req.params.id) {
          currentRoad = road;
          flag = false;
          break;
        }
      }
      if (flag) {
        res.redirect("/" + req.session.userID + "/road");
      } else {
        console.log(currentRoad);
        let filedata = [];
        fs.createReadStream("./public/data/" + currentRoad.filePath)
          .pipe(csv())
          .on("data", row => {
            filedata.push(row);
          })
          .on("end", () => {
            res.render("road", {
              data: {
                user: true,
                username: req.session.user,
                data: filedata,
                curRoad: req.params.id,
                roadData: currentRoad
              }
            });
            console.log("CSV file successfully processed");
          });
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post("/registerWorker", function(req, res) {
  const v = new Validator(req.body, {
    email: "required|email|maxLength:50",
    fname: "required|maxLength:20",
    lname: "required|maxLength:20",
    ph: "required|minLength:10|maxLength:10"
  });
  req.body.pass =
    "W" + req.body.email.substr(0, req.body.email.indexOf("@")) + "@RSQIS";
  v.check().then(matched => {
    if (!matched) {
      console.log(v.errors);

      res.status(422).render("register", {
        data: { error: v.errors, type: "W", user: true }
      });
    } else {
      if (true) {
        req.body.pass = auth.createSalt(req.body.pass);
        const users = database.addUser(req.body, "worker");
        users
          .then(function(rows) {
            res.status(200).redirect("/addWorker");
          })
          .catch(e => {
            res
              .status(422)
              .render("register", {
                data: { error: "some thing went wrong", type: "W", user: true }
              });
          });
      }
    }
  });
  //res.redirect("/");
});
router.get("/mngworker", function(req, res, next) {
  if (req.session.user) {
    const workers = database.getAllWorker();
    workers
      .then(result => {
        res.render("viewUser", {
          data: { user: result, username: req.session.user }
        });
      })
      .catch(() => {
        res.status(401).send("Some thing went wrong");
      });
  } else {
    res.redirect("/");
  }
});

/* GET road complaint page. */
router.get("/addworker", function(req, res, next) {
  if (req.session.user) {
    res.render("register", {
      data: { user: true, route: "/registerWorker", type: "W" }
    });
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

router.put("/road/filter/:id", (req, res) => {
  const fil = database.filterRoad(req.params.id);
  fil
    .then(
      res.send({
        op: true,
        msg: "Successfully done"
      })
    )
    .catch(e => {
      console.log(e);
      res.send({
        op: false,
        msg: "Something went wrong"
      });
    });
});

router.put("/road/reject/:id", (req, res) => {
  const fil = database.rejectRoad(req.params.id);
  fil
    .then(
      res.send({
        op: true,
        msg: "Successfully done"
      })
    )
    .catch(e => {
      console.log(e);
      res.send({
        op: false,
        msg: "Something went wrong"
      });
    });
});

router.get("/assignWork", (req, res) => {
  if (req.session.user) {
    const roads = database.getAllFilterdRoad();
    roads
      .then(result => {
        roadrows = result;
        const workers = database.getAllWorker();
        workers
          .then(data => {
            const workerrows = data;
            res.render("assign", {
              data: {
                user: true,
                username: req.session.user,
                roads: roadrows,
                worker: workerrows
              },
              username: req.session.user
            });
          })
          .catch(() => {
            res.send("Something went wrong");
          });
      })
      .catch(() => {
        res.send("Something went wrong");
      });
  } else {
    res.redirect("/");
  }
});

router.post("/assignWork", (req, res) => {
  if (req.session.user) {
    database
      .allcateWork(
        req.body.workername,
        req.session.userID,
        req.body.roadname,
        req.body.desc
      )
      .then(() => {
        res.redirect("/assignWork");
      })
      .catch(() => {
        res.send("something went wrong");
      });
  } else {
    res.redirect("/");
  }
});

router.get("/allAlocation", (req, res) => {
  if (req.session.user) {
    const all = database.getAllAlocation();
    all
      .then(result => {
        res.render("checkAllocation", {
          data: { alloc: result, username: req.session.user }
        });
      })
      .catch(() => {
        res.send("somethinf went wrong");
      });
  } else {
    res.redirect("/");
  }
});

router.get("/user/detail/:id", (req, res) => {
  if (req.session.user) {
    const user = database.getUserById(req.params.id);
    user
      .then(result => {
        res.render("userDetail", {
          data: { user: result, username: req.session.user }
        });
      })
      .catch(e => {
        res.send("Some thing went wrong");
      });
  } else {
    res.redirect("/");
  }
});
router.get("/road/detail/:id", (req, res) => {
  if (req.session.user) {
    res.redirect(`/${req.session.userID}/road/${req.params.id}`);
  } else {
    res.redirect("/");
  }
});

router.delete("/delete/alloc/:id", (req, res) => {
  if (req.session.user) {
    let re = database.deleteAlloc(req.params.id);
    re.then(() => {
      res.send({ op: true });
    });
  }
});

module.exports = router;
