const path = require("path");
const adminData = require("./admin");

const express = require("express");
const router = express.Router();
const rootDir = require('../util/path');


router.get("/", (req, res, next) => {
  console.log(adminData.products);
  const products = adminData.products;
  res.render("shop",{
    docTitle:"Shop",
    path:"/",
    products,
    hasProducts:products.length > 0,
    activeShop:true,
    shopCSS:true,
  });
});

module.exports = router;
