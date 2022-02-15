const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

router.get("/orders", productsController.getOrders);
router
  .route("/cart")
  .get(productsController.getCart)
  .post(productsController.postCart);
router.get("/checkout", productsController.getCheckout);
router.get("/products/:productId", productsController.getProductDetails);
router.get("/", productsController.getProducts);

module.exports = router;
