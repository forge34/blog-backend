const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const session = require("express-session")
const mongoStore = require("connect-mongo");
const passport = require("passport");
const { runDB } = require("./config/database");

const app = express();

// run DB function
runDB(process.env.DBURL)

// Session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store:mongoStore.create({mongoUrl:process.env.DBURL ,ttl: 14 * 24 * 60 * 60 })
  })
);


// Passport setup
require("./config/passport")
app.use(passport.session())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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
  res.json("error");
});

module.exports = app;
