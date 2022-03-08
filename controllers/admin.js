const Product = require("../models/product");
const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

const { handleServerError } = require("./error");
const { deleteFile } = require("../util/file");

const ITEMS_PER_PAGE = 2;

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  }

  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
    messages: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const errors = validationResult(req);
  const image = req.file;
  console.log(image);
  // throw new Error("TEST")
  if (!errors.isEmpty() || !image) {
    const messages = errors.array();
    if (!image) {
      messages.push({ param: "image", msg: "Attached file is not an image" });
    }
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add product",
      path: "/admin/add-product",
      activeAddProduct: true,
      productCSS: true,
      messages,
      oldBody: req.body,
    });
  }
  const product = new Product({
    title,
    imageUrl: image.path,
    description,
    price,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      handleServerError(err, next);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findOne({ _id: productId })
    .then((product) => {
      if (!product) {
        throw new Error("Product not found");
      } else if (product.userId.toString() !== req.user._id.toString()) {
        throw new Error("Unauthorized");
      } else {
        deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: productId });
      }
    })
    .then((result) => {
      res.status(200).json({
        message:"success"
      });
    })
    .catch((err) => res.status(500).json({
      message:"deleting products failed"
    }));
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  // req.user
  //   .getProducts({ where: { id: productId } })
  Product.findById(productId)
    .then((product) => {
      // const product = products[0];
      res.render("admin/edit-product", {
        docTitle: "Edit product",
        path: "/admin/add-product",
        activeAddProduct: true,
        productCSS: true,
        product,
      });
    })
    .catch((err) => handleServerError(err, next));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { title, price, description } = req.body;
  console.log(productId);
  const image = req.file;

  const errors = validationResult(req);
  Product.findOne({ _id: productId, userId: req.user })
    .then((product) => {
      if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
          docTitle: "Edit product",
          path: "/admin/edit-product/" + productId,
          activeAddProduct: true,
          productCSS: true,
          messages: errors.array(),
          oldBody: req.body,
          product,
        });
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log("Unauthorized");
        res.redirect("/");
      } else {
        if (image) {
          deleteFile(product.imageUrl);
        }
        product
          .updateOne({
            title,
            imageUrl: image?.path || product.imageUrl,
            price,
            description,
          })
          .then((result) => {
            res.redirect("/admin/products");
          })
          .catch((err) => {
            handleServerError(err, next);
          });
      }
    })
    .catch((err) => {
      handleServerError(err, next);
    });
};

exports.getAdminProducts = (req, res, next) => {
  // req.user.getProducts()
  const page = +req.query.page || 1;
  let totalItems;
  Product.find({ userId: req.user })
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find({ userId: req.user })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      // console.log(products)
      res.render("admin/products", {
        docTitle: "Admin Product",
        path: "/admin/products",
        products,
        isAdmin: true,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
      });
    })
    .catch((err) => {
      handleServerError(err, next);
    });
};
