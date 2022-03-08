const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const productValidation = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("The product title must be at least 3 characters long")
    .bail()
    .notEmpty()
    .withMessage("A product title is required"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("A valid product price is required.")
    .isFloat()
    .withMessage("The product price must be a number"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("A product description is required")
    .isLength({ min: 30, max: 1000 })
    .withMessage(
      "The product description should be between 30 and 1000 characters long"
    )
    .bail(),
];

const router = express.Router();
router.delete("/products/remove/:productId", adminController.deleteProduct);
router.use(isAuth);
router
  .route("/add-product")
  .get(adminController.getAddProduct)
  .post(productValidation, adminController.postAddProduct);
router.get("/products", adminController.getAdminProducts);
router
  .route("/products/edit/:productId")
  .get(adminController.getEditProduct)
  .post(productValidation, adminController.postEditProduct);

module.exports = router;
