const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/orders/:orderId",isAuth,shopController.getInvoice);
router.get("/orders", shopController.getOrders);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart/add", isAuth, shopController.postCart);
router.post("/cart/remove/", isAuth, shopController.postRemoveCartItem);
router.get("/checkout/success",shopController.getCheckoutSuccess);
router.get("/checkout/cancel",shopController.getCheckout);
router.get("/checkout",isAuth,shopController.getCheckout);
router.get("/products/:productId", shopController.getProductDetails);
router.get("/products", shopController.getProducts);
router.get("/", shopController.getIndex);

module.exports = router;
