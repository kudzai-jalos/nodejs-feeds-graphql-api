const express = require("express");
const path = require("path");

const router = express.Router();

const rootDir = require("../util/path");

const products = [];

router
  .route("/add-product")
  .get((req, res, next) => {
    res.render("add-product",{
      docTitle:"Add product"
    });
  })
  .post((req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect("/");
  });

exports.routes = router;
exports.products = products;
