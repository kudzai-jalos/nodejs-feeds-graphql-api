// import express module
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import controllers
const errorController = require("./controllers/error");
const User = require("./models/user");

// Import routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://KudzaiJalos_node-complete:Uy589Cc422wprtH@cluster0.zrgns.mongodb.net/shop?retryWrites=true&w=majority";
// Create an express application
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrf = require("csurf");
const flash = require("connect-flash");

const csrfProtection = csrf();

// Initialize database and models
// const { mongoConnect } = require("./util/database");
const mongoose = require("mongoose");

// app.set("views","views")
app.set("view engine", "ejs");

//********Add middleware*******
app.use(express.static("public"));

app.use(require("body-parser").urlencoded({ extended: false }));

app.use(
  session({
    secret: "m yse cret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash())
app.use((req, res, next) => {
  if (req.session?.isLoggedIn) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    next();
  }
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session?.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next()
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Add 404
app.use(errorController.get404);
// Listen for incoming requests

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
