const { body, validationResult } = require("express-validator");
const Comments = require("../models/comment-model");
const passport = require("passport");
const Posts = require("../models/post-model");
const expressAsyncHandler = require("express-async-handler");

module.exports.deleteComment = [
    passport.authenticate("jwt", { session: false }),
    expressAsyncHandler(async (req, res, next) => {
        const comment = await Comments.findById(req.params.commentid)
            .populate("author", "username")
            .exec();

        if (!comment) {
            res.status(404).json("Comment not found");
        } else if (
            req.user.isAdmin ||
            comment.author.username === req.user.username
        ) {
            await Comments.deleteOne(comment._id);
            res.status(200).json("Comment deletion success");
        } else {
            res.status(403).json({ errors: ["Access denied"] });
        }
    }),
];

module.exports.createComment = [
    passport.authenticate("jwt", { session: false }),
    body("body").trim().isLength({ min: 1 }).escape(),
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const comment = new Comments({
                body: req.body.body,
                author: req.user,
                postId: req.params.postid,
            });

            await comment.save();

            await Posts.updateOne(
                { _id: req.params.postid },
                { $push: { comments: comment } },
            );
            res.status(200).json("Comment create sucess");
        } else {
            res.status(403).json({ errors });
        }
    }),
];

module.exports.getComments = [
    expressAsyncHandler(async (req, res, next) => {
        const comments = await Comments.find().exec();
        res.json(comments);
    }),
];

module.exports.editComment = [
    passport.authenticate("jwt", { session: false }),
    body("editedComment").trim().isLength({ min: 1 }).escape(),
    expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const doc = await Comments.findOneAndUpdate(
                { _id: req.params.commentid },
                { body: req.body.editedComment },
            );
            res.status(200).json("Comment updated");
        } else {
            res.status(403).json(errors);
        }
    }),
];
