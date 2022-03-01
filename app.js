// import express module
const express = require("express");

// Import controllers
const errorController = require("./controllers/error");
const User = require("./models/user");

// Import routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Create an express application
const app = express();

// Initialize database and models
// const { mongoConnect } = require("./util/database");
const mongoose = require("mongoose");

// app.set("views","views")
app.set("view engine", "ejs");

//********Add middleware*******
app.use(express.static("public"));

app.use(require("body-parser").urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("621dda5bc03b59a23ba58edd")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Add 404
app.use(errorController.get404);
// Listen for incoming requests

const uri =
  "mongodb+srv://KudzaiJalos_node-complete:Uy589Cc422wprtH@cluster0.zrgns.mongodb.net/shop?retryWrites=true&w=majority";
mongoose
  .connect(uri).then((result)=>{
    return User.findById("621dda5bc03b59a23ba58edd");
  })
  .then((user) => {
    if (!user)
    {
      throw "User not found"
    }
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
