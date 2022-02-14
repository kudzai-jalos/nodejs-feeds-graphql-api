// import express module
const express = require("express");

const expressHbs = require("express-handlebars");
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

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// Add 404
app.use((req, res, next) => {
  res.status(404).render("404", { docTitle: "Page not found" });
});
// Listen for incoming requests
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
