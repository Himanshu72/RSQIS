var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var busboy = require("connect-busboy");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var session = require("express-session");
var app = express();
var config = require("./config");
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 50000,
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(busboy());

app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
  })
);

// var favicon = require("serve-favicon");
// app.use(favicon(__dirname + "/public/images/logo.png"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// app.use(logger("dev"));

// // Setting app methods

// app.use(express.static(path.join(__dirname, "public")));

//app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/worker", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
