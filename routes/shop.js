const path = require("path");
const adminData = require("./admin");

const express = require("express");
const router = express.Router();
const rootDir = require('../util/path');


router.get("/", (req, res, next) => {
  console.log(adminData.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop",{
    docTitle:"Shop",
    products:adminData.products
  });
});

module.exports = router;
