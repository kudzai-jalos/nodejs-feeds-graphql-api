// import express module
const express = require("express");

const expressHbs = require("express-handlebars");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// Create an express application
const app = express();

// Config
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
app.set("view engine", "ejs");
// app.set("views","views")

//********Add middleware*******
app.use(express.static("public"));
app.use(require("body-parser").urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Add 404
app.use(errorController.get404);
// Listen for incoming requests
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
