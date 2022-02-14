const express = require("express");

const productsController = require("../controllers/products");


const router = express.Router();

router.route("/add-product")
  .get(productsController.getAddProduct)
  .post(productsController.postAddProduct);

module.exports = router;
