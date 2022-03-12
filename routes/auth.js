const { body } = require("express-validator");
const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/user");
router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Password should be at least 5 characters long. Please try again."
    ).isLength({
      min: 5,
    }),
    body("name", "Please enter a valid name.").trim().notEmpty(),
  ],
  authController.putSignup
);

router.post("/login", authController.postLogin);

module.exports = router;
