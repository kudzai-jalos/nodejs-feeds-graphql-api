const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

router.get("/orders", productsController.getOrders);
router.get("/cart", productsController.getCart);
router.post("/cart/add", productsController.postCart);
router.post("/cart/remove/:productId", productsController.postRemoveCartItem);
router.get("/checkout", productsController.getCheckout);
router.get("/products/:productId", productsController.getProductDetails);
router.get("/", productsController.getProducts);

module.exports = router;
