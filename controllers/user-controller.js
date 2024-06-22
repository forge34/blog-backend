const passport = require("passport");
const Posts = require("../models/post-model");
const expressAsyncHandler = require("express-async-handler");
const Comments = require("../models/comment-model.js");

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

module.exports.getComments = [
    passport.authenticate("jwt", { session: false }),
    expressAsyncHandler(async (req, res, next) => {
        console.log(req.user);
        const posts = await Comments.find({
            author: {
                _id: req.user._id,
            },
        })
            .populate("author", "username")
            .exec();
        res.json(posts);
    }),
];
