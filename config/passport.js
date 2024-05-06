const expressAsyncHandler = require("express-async-handler");
const passport = require("passport");
const localStrategy = require("passport-local");
const Users = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwtStrategy = require("passport-jwt").Strategy;
const extract = require("passport-jwt").ExtractJwt;

const verify = expressAsyncHandler(async (username, password, done) => {
    const user = await Users.findOne()
        .where("username")
        .equals(username)
        .exec();

    if (!user) {
        return done(null, false, { message: "User doesn't exist" });
    }

    const match = bcrypt.compare(password, user.password);

    if (!match) {
        console.log("invalid pass");
        return done(null, false), { message: "Invalid password" };
    }

    return done(null, user);
});

const localStrat = new localStrategy(verify);

/* Jwt implementation */

// JWT options
const opts = {};
opts.jwtFromRequest = extract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

const jwtStrat = new jwtStrategy(opts, async (payload, done) => {
    const user = await Users.findById(payload.id).exec();

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});

passport.use(localStrat);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id).select({ password: 0 }).exec();
    done(null, user);
});

passport.use(jwtStrat);
