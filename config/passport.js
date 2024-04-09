const expressAsyncHandler = require("express-async-handler")
const passport = require("passport")
const localStrategy = require("passport-local")
const Users = require("../models/user-model")
const bcrypt = require("bcryptjs")

const verify = expressAsyncHandler(async (username , password , done) => {
    const user = await Users.findOne().where("name").equals(username).exec()

    if (!user) {
        return done(null , false)
    }

    const match = bcrypt.compare(password , user.password)

    if (!match) {
        return done(null,false)
    }

    return done(null,user)
})


const strategy = new localStrategy(verify)

passport.use(strategy)

