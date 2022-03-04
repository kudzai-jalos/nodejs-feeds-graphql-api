const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/orders", shopController.getOrders);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart/add", isAuth, shopController.postCart);
router.post("/cart/remove/", isAuth, shopController.postRemoveCartItem);
router.post("/cart/checkout", isAuth, shopController.postCheckout);
router.get("/products/:productId", shopController.getProductDetails);
router.get("/products", shopController.getProducts);
router.get("/", shopController.getIndex);

module.exports = router;
