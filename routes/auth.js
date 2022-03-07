const express = require("express");

const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("An account with that email already exists");
          }
        });
      }).normalizeEmail(),
    body(
      "password",
      "Please enter a password that is at least 5 characters long and it should only contain alphanumeric characters."
    )
      .isLength({ min: 5 })
      .bail()
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Invalid email or password")
      .isEmail()
      .bail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Please enter a valid email");
          }
        });
      }).normalizeEmail(),
    body("password", "Invalid email or password").custom((value, { req }) => {
      return User.findOne({ email: req.body.email }).then((user) => {
        return bcrypt.compare(value, user.password).then((doMatch) => {
          if (!doMatch) {
            // Wrong password
            return Promise.reject("Please enter a valid password");
          }
          req.session.user = user;
        });
      });
    }),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);
router.get("/new-password/:token", authController.getNewPassword);

module.exports = router;
