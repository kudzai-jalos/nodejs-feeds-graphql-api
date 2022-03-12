const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
const postInputValidation = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];
const feedController = require("../controllers/feed");
router
  .route("/posts/:postId")
  .get(isAuth, feedController.getPost)
  .put(isAuth, postInputValidation, feedController.updatePost)
  .delete(isAuth, feedController.deletePost);

router
  .route("/posts")
  .post(isAuth, postInputValidation, feedController.createPost)
  .get(isAuth, feedController.getPosts);
router
  .route("/status")
  .put(isAuth, feedController.updateStatus)
  .get(isAuth, feedController.getStatus);
module.exports = router;
