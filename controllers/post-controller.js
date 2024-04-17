const { body, validationResult } = require("express-validator");
const Posts = require("../models/post-model");
const expressAsyncHandler = require("express-async-handler");
const passport = require("passport");



module.exports.getPost = [
    passport.authenticate("jwt" , {session:false}),
    expressAsyncHandler(async(req,res,next) => {
        const post = await Posts.findById(req.params.postid).exec()
        res.json(post);        
    })
]

module.exports.getPosts = [
    passport.authenticate("jwt", { session: false }),
    expressAsyncHandler(async (req, res, next) => {
        const posts = await Posts.find().exec();
        res.json(posts);
    }),
];

module.exports.createPost = [
    passport.authenticate("jwt", { session: false }),
    body("body").trim().isLength({ min: 1 }).escape(),
    body("title").trim().isLength({ min: 1 }).escape(),
    body("isPublished").toBoolean(),
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        consolr.log(req.body);
        if (errors.isEmpty()) {
            console.log(req.user);
            const post = new Posts({
                title: req.body.title,
                body: req.body.body,
                author: req.user,
                isPublished: req.body.isPublished,
            });
            console.log(post);
            await post.save();
            res.json({ message: "Post created" });
        } else {
            res.status(403).json({ errors: errors });
        }
    }),
];
