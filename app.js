const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const { runDB } = require("./config/database");
const cors = require("cors");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require("passport");

const app = express();
require("dotenv").config();
// run DB function
runDB(process.env.DBURL);

const corsOptions = {
    origin: [
        "https://forge-blog-frontend.netlify.app",
        "http://localhost:5173",
        "https://forge-blog-cms.netlify.app",
        "http://localhost:5174",
        "https://669687be0dc8453c1f4dbd8d--forge-blog-frontend.netlify.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: process.env.DBURL,
            ttl: 14 * 24 * 60 * 60,
        }),
    }),
);

// Passport setup
require("./config/passport");
app.use(passport.session());

// Other
app.use("/api", indexRouter);

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
    res.json(err.message);
});

module.exports = app;
