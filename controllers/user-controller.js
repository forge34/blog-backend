const passport = require("passport");
const Posts = require("../models/post-model");
const expressAsyncHandler = require("express-async-handler");

module.exports.getPosts = [
    passport.authenticate("jwt", { session: false }),
    expressAsyncHandler(async (req, res, next) => {
        const posts = await Posts.find({
            author: {
                _id: req.user._id,
            },
        })
            .populate("author", "username")
            .exec();
        res.json(posts);
    }),
];
