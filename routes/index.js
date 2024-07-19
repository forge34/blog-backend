const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller");
const passport = require("passport");
const postController = require("../controllers/post-controller");
const commentsController = require("../controllers/comment-controller");
const userController = require("../controllers/user-controller");
const createHttpError = require("http-errors");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.status(200).json("Index route");
});

// Get & Create post routes
router.get("/posts", postController.getPosts);
router.post("/posts", postController.createPost);

// single post routes
router.get("/posts/:postid", postController.getPost);
router.delete("/posts/:postid", postController.deletePost);
router.put("/posts/:postid/edit", postController.editPost);

// Comment routes
router.get("/posts/:postid/comments", commentsController.getComments);
router.post("/posts/:postid/comments", commentsController.createComment);
router.delete("/comments/:commentid", commentsController.deleteComment);
router.put("/comments/:commentid/edit", commentsController.editComment);

// User routes
router.get(
    "/users/verify",
    function (req, res, next) {
        passport.authenticate(
            "jwt",
            { session: false },
            function (err, user, info) {
                // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
                if (err || !user) {
                    return next(createHttpError(401, info));
                } else {
                    req.logIn(user, next);
                }
            },
        )(req, res, next);
    },
    (req, res) => {
        console.log(req.user);
        res.status(200).json({
            message: "vertifcation sucess",
            user: req.user,
        });
    },
);

router.get("/user/posts", userController.getPosts);
router.get("/user/comments", userController.getComments);

// authenticatation routes
router.post("/login", authenticationController.login);
router.post("/signup", authenticationController.signup);

module.exports = router;
