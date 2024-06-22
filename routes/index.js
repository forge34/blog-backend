const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller");
const passport = require("passport");
const postController = require("../controllers/post-controller");
const commentsController = require("../controllers/comment-controller");
const userController = require("../controllers/user-controller");

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
router.delete(
    "/comments/:commentid",
    commentsController.deleteComment,
);

// User routes
router.get(
    "/users/verify",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        return res
            .status(200)
            .json({ message: "vertifcation sucess", user: req.user });
    },
);
router.get("/user/posts", userController.getPosts);
router.get("/user/comments", userController.getComments);

// authenticatation routes
router.post("/login", authenticationController.login);
router.post("/signup", authenticationController.signup);

module.exports = router;
