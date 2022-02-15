const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

router
  .route("/add-product")
  .get(productsController.getAddProduct)
  .post(productsController.postAddProduct);
router.post("/products/remove");
router.get("/products", productsController.getAdminProducts);
router
  .route("/products/edit/:productId")
  .get(productsController.getEditProduct)
  .post(productsController.postEditProduct);

module.exports = router;
