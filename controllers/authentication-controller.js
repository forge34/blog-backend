const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const bycrpt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.loginPost = (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.redirect("/login");
            }

            jwt.sign({ user: user.name }, process.env.SECRET, (err, token) => {
                console.log(token);
            });
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                } else res.json("Login success");
            });
        })(req,res,next);
};

module.exports.signupPost = expressAsyncHandler(async (req, res, next) => {
    console.log(req.body);

    bycrpt.hash(
        req.body.password,
        10,
        expressAsyncHandler(async (err, hashed) => {
            const user = new User({
                username: req.body.username,
                password: hashed,
            });

            await user.save();
            console.log(user);
        })
    );

    res.json(`user registered`);
});
