const express = require("express");
const {body} = require("express-validator")

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts/:postId",feedController.getPost);
router.post("/posts",[
  body("title").trim().isLength({min:5}),
  body("content").trim().isLength({min:5})
],feedController.createPost);
router.get("/posts",feedController.getPosts);


module.exports=router;