const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const bycrpt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

module.exports.login = [
    body("username").trim().escape(),
    body("password").trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            next();
        } else res.status(404).json({ errors: errors });
    },
  // passport local authenticatation request
    (req, res, next) => {
        console.log(req.body);
        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            } else if (!user) {
                res.status(401).json({
                    errors: ["Login failed ,invalid username or password"],
                });
            } else {
                jwt.sign({ id: user.id }, process.env.SECRET, (_err, token) => {
                    req.login(user, (err) => {
                        if (err) {
                            return next(err);
                        } else
                            res.json({
                                message: "Login success",
                                token,
                                userId: user.id,
                            });
                    });
                });
            }
        })(req, res, next);
    },
];

module.exports.signup = [
    body("username").trim().isLength({ max: 128 }).escape(),
    body("password").trim().isLength({ min: 8 }).escape(),
    body("isAdmin").toBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            next();
        } else return res.status(404).json({ errors: errors });
    },
    expressAsyncHandler(async (req, res, _next) => {
        bycrpt.hash(
            req.body.password,
            10,
            expressAsyncHandler(async (_err, hashed) => {
                const user = new User({
                    username: req.body.username,
                    password: hashed,
                });

                await user.save();
                console.log(user);
            }),
        );
        res.json(`user registered`);
    }),
];
