const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  }
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product({
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
      console.log(err);
    });
};

exports.postRemoveProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { title, imageUrl, price, description } = req.body;
  console.log(productId);
  // req.user
  //   .getProducts({ where: { id: productId } })

  Product.findById(productId)
    .then((product) => {
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
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
    });
};
