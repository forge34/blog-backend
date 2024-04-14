const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller");
const passport = require("passport");
const postController = require("../controllers/post-controller");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json(req.session);
});

router.get("/posts" , postController.getPosts);

router.post("/posts", postController.createPost);

router.get("/posts/:postid");

router.get("/posts/:postid/comments");
router.post("/posts/:postid/comments");

router.get("/posts/:postid/comments/:commentid");

router.post("/login", authenticationController.login);

router.post("/signup", authenticationController.signup);

router.post(
    "/profile",
    passport.authenticate("jwt", { session:false}),
     (req, res ,next) => {
        res.json("Test");
    }
);

module.exports = router;
