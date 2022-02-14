const express = require("express");

const productsController = require("../controllers/products");


const router = express.Router();

router.route("/add-product")
  .get(productsController.getAddProduct)
  .post(productsController.postAddProduct);

router.get("/products",productsController.getAdminProducts);
router.get(productsController.getEditProduct);


module.exports = router;
