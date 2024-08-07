const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const bycrpt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

module.exports.login = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Username too short")
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 chars")
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            next();
        } else
            res.status(401).json({
                username: errors.errors[0],
                password: errors.errors[1],
            });
    },
    // passport local authenticatation request
    (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            } else if (!user) {
                res.status(401).json({
                    error: "Login failed ,invalid username or password",
                });
            } else {
                req.login(user, next);
            }
        })(req, res, next);
    },
    (req, res, next) => {
        jwt.sign({ id: req.user.id }, process.env.SECRET, (_err, token) => {
            res.cookie("jwt", token, {
                secure: true,
                httpOnly: true,
                sameSite: "none",
            });
            res.status(200).json({
                ok: true,
            });
        });
    },
];

module.exports.signup = [
    body("username")
        .trim()
        .isLength({ max: 128 })
        .custom(async (val) => {
            const user = await User.findOne()
                .where("username")
                .equals(val)
                .exec();

            if (user) {
                throw new Error("Username already in use");
            }
        })
        .escape(),
    body("password").trim().isLength({ min: 8 }).escape(),
    body("confirmPassword")
        .trim()
        .isLength({ min: 8 })
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .escape(),
    body("isAdmin").toBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else return res.status(403).json({ errors });
    },
    expressAsyncHandler(async (req, res, _next) => {
        bycrpt.hash(
            req.body.password,
            10,
            expressAsyncHandler(async (_err, hashed) => {
                const user = new User({
                    username: req.body.username,
                    password: hashed,
                    role: req.body.isAdmin ? "ADMIN" : "NORMAL",
                });

                await user.save();
                console.log(user);
                res.json({ ok: true, message: `user registered` });
            }),
        );
    }),
];
