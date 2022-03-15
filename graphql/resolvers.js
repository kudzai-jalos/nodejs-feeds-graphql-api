const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Post = require("../models/post");

const { clearImage } = require("../util/file");
module.exports = {
  createUser({ userInput }, req) {
    const { email, name, password } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({
        message: "Email is invalid",
      });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({
        message: "Password has to be at least 5 characters long.",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    return User.findOne({ email })
      .then((user) => {
        if (user) {
          const error = new Error("User exists already");
          throw error;
        }

        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const newUser = new User({
          email,
          name,
          password: hashedPassword,
        });
        return newUser.save();
      })
      .then((result) => {
        return {
          ...result._doc,
          _id: result._id.toString(),
        };
      });
  },
  login({ email, password }, req) {
    let loadedUser;
    return User.findOne({ email })
      .then((user) => {
        if (!user) {
          const error = new Error("User not found.");
          error.code = 401;
          throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          const error = new Error("Password is incorrect.");
          error.code = 401;
          throw error;
        }

        const token = jwt.sign(
          {
            userId: loadedUser._id.toString(),
            email: loadedUser.email,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        return {
          token,
          userId: loadedUser._id.toString(),
        };
      });
  },
  createPost({ postInput }, req) {
    console.log("Post will be created after successful validation");
    const { title, content, imageUrl } = postInput;
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }

    let creator;
    let savedPost;
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });
    return User.findById(req.userId)
      .then((user) => {
        if (!user) {
          const error = new Error("User not found.");
          error.code = 401;
          throw error;
        }
        creator = user;

        return post.save();
      })
      .then((result) => {
        savedPost = result;
        creator.posts.push(post);
        return creator.save();
      })
      .then((result) => {
        return {
          ...savedPost._doc,
          creator,
          createdAt: savedPost._doc.createdAt.toISOString(),
        };
      });
  },
  getPosts({ page }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }
    let totalItems;
    page = page || 1;
    const ITEMS_PER_PAGE = 2;
    return Post.countDocuments()
      .then((count) => {
        totalItems = count;
        return Post.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
          .populate("creator");
      })
      .then((posts) => {
        return {
          posts: posts.map((post) => ({
            _id: post._id,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            creator: post.creator,
            createdAt: post.createdAt.toISOString(),
          })),
          totalItems,
        };
      });
  },
  getPost({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }

    return Post.findById(postId)
      .populate("creator")
      .then((post) => {
        if (!post) {
          const error = new Error("Post not found");
          error.code = 404;
          throw error;
        }
        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          creator: post.creator,
          createdAt: post.createdAt.toISOString(),
        };
      });
  },
  getUser(args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }

    return User.findById(req.userId).then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.code = 404;
        throw error;
      }
      console.log(user);
      return user;
    });
  },
  updateStatus({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }

    return User.findById(req.userId)
      .then((user) => {
        if (!user) {
          const error = new Error("User not found.");
          error.code = 401;
          throw error;
        }
        user.status = status;
        return user.save();
      })
      .then((result) => {
        return result._doc.status;
      });
  },
  deletePost({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }
    let loadedPost;
    return Post.findById(postId)
      .then((post) => {
        if (!post) {
          const error = new Error("Post not found");
          error.code = 404;
          throw error;
        }
        loadedPost = post;
        return User.findById(req.userId);
      })
      .then((user) => {
        if (!user) {
          const error = new Error("User not found");
          error.code = 404;
          throw error;
        }
        user.posts.pull(loadedPost);
        return user.save();
      })
      .then((result) => {
        return loadedPost.deleteOne();
      })
      .then((result) => {
        clearImage(loadedPost.imageUrl);
        return {
          message: "Post deleted.",
        };
      });
  },
  updatePost({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }
    const { postId, title, content, imageUrl } = postInput;
    let loadedUser;
    let savedPost;
    return User.findById(req.userId)
      .then((user) => {
        if (!user) {
          const error = new Error("User not found");
          error.code = 404;
          throw error;
        }
        loadedUser = user;
        return Post.findById(postId);
      })
      .then((post) => {
        if (!post) {
          const error = new Error("Post not found");
          error.code = 404;
          throw error;
        }
        if (post.creator.toString() !== req.userId) {
          const error = new Error("Not authorized");
          error.code = 401;
          throw error;
        }
        post.title = title;
        console.log(imageUrl)
        post.imageUrl = (imageUrl || imageUrl !=="undefined") ? imageUrl : post.imageUrl;
        post.content = content;

        return post.save();
      })
      .then((result) => {
        savedPost = result;
        // const embeddedPost = loadedUser.posts.id(postId);
        // embeddedPost.title = title;
        // embeddedPost.imageUrl = imageUrl || embeddedPost.imageUrl;
        // embeddedPost.content = content;
        loadedUser.posts = loadedUser.posts.map((post) => {
          return post._id.toString !== postId
            ? post
            : {
                ...post,
                title,
                content,
                imageUrl,
              };
        });
        return loadedUser.save();
      })
      .then((result) => {
        return Post.findById(postId).populate("creator");
      })
      .then((post) => {
        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          creator: post.creator,
          createdAt: post.createdAt.toISOString(),
        };
      });
  },
};
