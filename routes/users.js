var express = require("express");
var router = express.Router();
var database = require("./database");
var android = require("./android");
var service = require("../service");
var base64ToImage = require("base64-to-image");

var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
var upload = multer({ storage: storage });
/* GET users listing. */
router.get("/", function (req, res, next) {
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
    .then((result) => {
      if (service.undoSalt(result[0].Pasword) === req.body.password) {
        result[0].Pasword = req.body.password;
        if (result[0].role == "admin") {
          res.json({
            status: 400,
            msg: "invalid password",
          });
        }
        res.json(result[0]);
      } else {
        res.json({
          status: 400,
          msg: "invalid password",
        });
      }
    })
    .catch((e) => {
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
    .catch((e) => {
      console.log(e);
      if ((e.errno = 1062)) {
        res.json({ status: 400, msg: "user already exsist" });
      } else {
        res.json({ status: 400, msg: e.message });
      }
    });
});

router.post("/getRoad", (req, res) => {
  const workerID = req.body.workerID;
  const data = android.getAlloc(workerID);

  data
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.send("No Work Assign");
    });
});

router.post("/uploadProof", (req, res) => {
  // console.log(req.body);
  var base64Str = req.body.img;

  var path = __dirname + "/../public/images/";

  var date = new Date();
  var optionalObj = { fileName: date.getTime(), type: "png" };
  const { fileName } = base64ToImage(base64Str, path, optionalObj);

  const obj = {
    desc: req.body.desc,
    path: fileName,
    workID: req.body.workID,
    roadID: req.body.roadID,
  };
  console.log(obj);
  const data = android.addProof(obj);
  data
    .then((res) => {
      res.send("ok");
    })
    .catch(() => {
      res.send("ok");
    });
});

router.post("/road/cords", async (req, res) => {
  const id = req.body.roadID;
  console.log(id);
  const road = database.getRoad(id);
  road
    .then((result) => {
      const data = service.getCords(
        __dirname + "/../public/data/" + result[0].filePath
      );
      data
        .then((fin) => {
          res.send(fin);
        })
        .catch(() => {
          res.send("no road found");
        });
    })
    .catch(() => {
      res.send("no road found");
    });
});
router.post("/feedback", (req, res) => {
  var base64Str = req.body.img;
  var path = __dirname + "/../public/images/";
  var date = new Date();
  var optionalObj = { fileName: date.getTime(), type: "png" };
  const { fileName } = base64ToImage(base64Str, path, optionalObj);
  const obj = {
    path: fileName,
    pubID: req.body.publicID,
    issue: req.body.issue,
    lng: req.body.lng,
    lat: req.body.lat,
    add: req.body.add,
  };

  android.addFeed(obj);
  console.log(obj);
  res.send("ok");
});
module.exports = router;
