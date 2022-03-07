const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: process.env.API_KEY,
      domain: process.env.API_DOMAIN,
    },
  })
);

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    docTitle: "Signup",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;
  // TODO Validate inputs
  // Check if email exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // create user
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email,
              username,
              password: hashedPassword,
              cart: { items: [], totalPrice: 0 },
            });
            return user.save();
          })
          .then(() => {
            // success
            res.redirect("/login");
            return transporter.sendMail({
              to: email,
              from: "kudzai.jalos@younglings.africa",
              subject: "Signup succeeded",
              html: "<h1>You successfully signed up</h1>",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.flash("error", "Email already exists");
        res.redirect("/signup");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // TODO Validate user credentials

  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              // console.log(req.session);
              res.redirect("/");
            } else {
              // Wrong password
              req.flash("error", "Invalid email or password");
              console.log("WRONG_PASSWORD");
              res.redirect("/login");
            }
          })
          .catch((err) => {
            // Comparison error
            console.log("COMP_ERR");
            console.log(err);
            req.flash("error", "Something went wrong...");
            res.redirect("/login");
          });
      } else {
        // user not found
        console.log("USER_NOT_FOUND");
        req.flash("error", "Invalid email or password");
        res.redirect("/login");
      }
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  const { username, password } = req.body;
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    docTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  // Create token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "An account with that email does not exist.");
          res.redirect("/reset");
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save().then((result) => {
            res.redirect("/");
            // Send email
            return transporter.sendMail({
              to: email,
              from: "kudzai.jalos@younglings.africa",
              subject: "Password reset request",
              html: `
              <main>
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/new-password/${token}>link</a> to set a new password.</p>
              </main>
              `,
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  console.log(token)
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        let message = req.flash("error");
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render("auth/new-password", {
          docTitle: "New Password",
          path: "/new-password",
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token,
        });
      } else {
        console.log("Expired or incorrect token");
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { userId, password, passwordToken } = req.body;
  console.log("password resetting");
  console.log(userId,password,passwordToken);
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      console.log("User not found")
    }
    else {
      bcrypt.hash(password,12).then(hashedPassword=>{
        user.password = hashedPassword;
        resetToken=undefined,
        resetTokenExpiration = undefined;
        return user.save();
      }).then((result)=>{
        // Optionally send confirmation email
        res.redirect("/login");
      }).catch(err=>{
        res.redirect("/")
        console.log(err);
      })
    }
  }).catch(err=>{
    res.redirect("/");
    console.log(err);
  });
};
