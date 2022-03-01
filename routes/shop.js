const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/orders", shopController.getOrders);
router.get("/cart", shopController.getCart);
router.post("/cart/add", shopController.postCart);
router.post("/cart/remove/", shopController.postRemoveCartItem);
router.post("/cart/checkout",shopController.postCheckout);
router.get("/products/:productId", shopController.getProductDetails);
router.get("/products", shopController.getProducts);
router.get("/",shopController.getShop);

module.exports = router;
