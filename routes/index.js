const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller")

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json(req.session)
});

router.get("/posts" , )

router.post("/posts" , )

router.get("/posts/:postid" ,)

router.get("/posts/:postid/comments")
router.post("/posts/:postid/comments");

router.get("/posts/:postid/comments/:commentid");

router.post("/login" , authenticationController.loginPost);

router.post("/signup" , authenticationController.signupPost);

module.exports = router;
