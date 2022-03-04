const bcrypt = require("bcryptjs");

const User = require("../models/user");

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
