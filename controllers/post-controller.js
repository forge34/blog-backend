const { body, validationResult } = require("express-validator");
const Posts = require("../models/post-model");
const expressAsyncHandler = require("express-async-handler");
const passport = require("passport");

module.exports.deletePost = [
    passport.authenticate("jwt", { session: false }),
    expressAsyncHandler(async (req, res, next) => {
        const post = await Posts.findById(req.params.postid)
            .populate("author", "username")
            .exec();

        if (!post) {
            res.status(404).json({ errors: ["Post not found"] });
        } else if (
            req.user.role == "ADMIN" ||
            post.author._id === req.user._id
        ) {
            await Posts.deleteOne(post._id);
            res.status(200).json("Delete success");
        } else {
            res.status(403).json({
                errors: ["Failed to delete ,  Users does not have permission"],
            });
        }
    }),
];

module.exports.getPost = [
    expressAsyncHandler(async (req, res, next) => {
        const post = await Posts.findById(req.params.postid)
            .populate("author", "username")
            .populate("comments")
            .exec();
        res.json(post);
    }),
];

module.exports.getPosts = [
    expressAsyncHandler(async (req, res, next) => {
        const posts = await Posts.find()
            .populate("author", "username")
            .populate("comments")
            .exec();
        res.json(posts);
    }),
];

module.exports.createPost = [
    passport.authenticate("jwt", { session: false }),
    body("body").isLength({ min: 1 }),
    body("title").trim().isLength({ min: 1 }).escape(),
    body("isPublished").toBoolean(),
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const post = new Posts({
                title: req.body.title,
                body: req.body.body,
                author: req.user,
                isPublished: req.body.isPublished,
            });
            await post.save();
            res.json({ message: "Post created" });
        } else {
            res.status(403).json({ errors: errors });
        }
    }),
];
