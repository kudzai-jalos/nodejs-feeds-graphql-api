const path = require("path");
// import express module
const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// Create an express application
const app = express();

// Config
app.set("view engine", "pug");

//********Add middleware*******
app.use(express.static("public"));
app.use(require("body-parser").urlencoded({ extended: false }));

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// Add 404
app.use((req, res, next) => {
  res.status(404).render("404");
});
// Listen for incoming requests
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
