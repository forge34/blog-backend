const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller");
const passport = require("passport");
const postController = require("../controllers/post-controller");
const commentsController = require("../controllers/comment-controller");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json(req.session);
});

// Get & Create post routes
router.get("/posts", postController.getPosts);
router.post("/posts", postController.createPost);

// single post routes
router.get("/posts/:postid", postController.getPost);
router.delete("/posts/:postid", postController.deletePost);

// Comment routes
router.get("/posts/:postid/comments", commentsController.getComments);
router.post("/posts/:postid/comments", commentsController.createComment);
router.delete("/posts/:postid/comments/:commentid" , commentsController.deleteComment);

// authenticatation routes
router.post("/login", authenticationController.login);
router.post("/signup", authenticationController.signup);

// Test routes
router.post(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        res.json("Test");
    },
);

module.exports = router;
