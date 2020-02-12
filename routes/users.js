var express = require("express");
var router = express.Router();
var database = require("./database");
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

module.exports = router;
