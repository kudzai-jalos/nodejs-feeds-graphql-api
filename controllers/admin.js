const Product = require("../models/product");
const {validationResult} = require("express-validator");
const { ObjectId } = require("mongodb");

const {handleServerError} = require("./error");

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  }
  

  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
    messages:[],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add product",
      path: "/admin/add-product",
      activeAddProduct: true,
      productCSS: true,
      messages:errors.array(),
      oldBody:req.body,
    });
  }
  const product = new Product({
    _id:new ObjectId("6225d4947587a760b9b04cad"),//ERROR HANDLING TEST
    title,
    imageUrl,
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
      handleServerError(err,next);
      handleServerError(err,next);
    });
};

exports.postRemoveProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => handleServerError(err,next));
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
    .catch((err) => handleServerError(err,next));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { title, imageUrl, price, description } = req.body;
  console.log(productId);

  const errors = validationResult(req);
  Product.findOne({_id:productId,userId:req.user})
    .then((product) => {
      if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
          docTitle: "Edit product",
          path: "/admin/edit-product/"+productId,
          activeAddProduct: true,
          productCSS: true,
          messages:errors.array(),
          oldBody:req.body,
          product
        });
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log("Unauthorized");
        res.redirect("/");
      } else {
        product
          .updateOne({ title, imageUrl, price, description })
          .then((result) => {
            res.redirect("/admin/products");
          })
          .catch((err) => {
            handleServerError(err,next);
          });
      }
    })
    .catch((err) => {
      handleServerError(err,next);
    });
};

exports.getAdminProducts = (req, res, next) => {
  // req.user.getProducts()

  Product.find({ userId: req.user })
    .then((products) => {
      // console.log(products)
      res.render("admin/products", {
        docTitle: "Admin Product",
        path: "/admin/products",
        products,
        isAdmin: true,
      });
    })
    .catch((err) => {
      handleServerError(err,next);
    });
};
