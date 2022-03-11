const { validationResult } = require("express-validator");
const Post = require("../models/post");

const handleError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched",
        posts,
        totalItems: posts.length,
      });
    })
    .catch((err) => {
      handleError(err, next);
    });
};

exports.createPost = (req, res, next) => {
  console.log("Requested to create post")
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty() || !req.file) {
    const err = new Error(
      req.file
        ? "Validation failed. Entered data is invalid."
        : "No image provided"
    );
    err.statusCode = 422;
    throw err;
  }
  // Store in database
  // res.status()
  const imageUrl = req.file.filename;
  const post = new Post({
    title,
    imageUrl,
    content,
    creator: {
      name: "Kudzai",
    },
  });
  console.log("post",post)
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      handleError(err, next);
    });
};

exports.putPost = (req,res,next)=>{
  console.log("Requested to create post")
  const { title, content } = req.body;
  const {postId} = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error(
      req.file
        ? "Validation failed. Entered data is invalid."
        : "No image provided"
    );
    err.statusCode = 422;
    throw err;
  }
  // Store in database
  // res.status()
  const imageUrl = req.file.filename;
}

exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Could not find post.");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "Post fetched",
        post,
      });
    })
    .catch((err) => {
      handleError(err, next);
    });
};
