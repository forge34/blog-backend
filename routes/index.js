const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json(req.session)
});

router.get("/posts" , (req,res,next) => {
  res.json("GET request to /post")
})

router.post("/posts" , (req,res,next) => {
  res.json("POST request to /post")
})

router.get("/posts/:postid" , (req,res,next) => {
  res.json("GET returns a specific post")
})

module.exports = router;
