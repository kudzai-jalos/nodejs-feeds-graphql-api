const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, price, description } = req.body;
  const product = new Product(title, imgUrl, description, price);
  product.save();
  res.redirect("/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      docTitle: "Shop",
      path: "/",
      products,
      hasProducts: products.length > 0,
      activeShop: true,
      shopCSS: true,
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  res.render("admin/products/edit", {
    docTitle: "Add product",
    path: "/admin/products/edit",
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      docTitle: "Admin Product",
      path: "/admin/products",
      products,
      isAdmin:true,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "My Cart",
    path: "/cart",
  });
};


exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "My Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render("shop/products-details", {
    docTitle: "Product details",
    path: "/product-details",
  });
};
