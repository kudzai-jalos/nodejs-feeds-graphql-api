const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router
  .route("/add-product")
  .get(adminController.getAddProduct)
  .post(adminController.postAddProduct);
router.post("/products/remove",adminController.postRemoveProduct);
router.get("/products", adminController.getAdminProducts);
router
  .route("/products/edit/:productId")
  .get(adminController.getEditProduct)
  .post(adminController.postEditProduct);

module.exports = router;
