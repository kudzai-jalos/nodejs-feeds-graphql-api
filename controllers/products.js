const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
  });
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render("admin/edit-product", {
      docTitle: "Edit product",
      path: "/admin/add-product",
      activeAddProduct: true,
      productCSS: true,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { title, imgUrl, price, description } = req.body;

  Product.findById(productId, (product) => {
    console.log(product);
    Product.update(product.id, title, imgUrl, description, price);

    res.redirect("/admin/products");
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, price, description } = req.body;
  const product = new Product(title, imgUrl, description, price);
  product.save();
  res.redirect("/admin/products");
};

exports.postRemoveProduct = (req,res,next) => {
  const { productId } = req.body;
  Product.remove(productId);
  res.redirect("/admin/products");
}

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

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      docTitle: "Admin Product",
      path: "/admin/products",
      products,
      isAdmin: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "My Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  });

  res.redirect("/cart");
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
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render("shop/product-details", {
      docTitle: product.title,
      path: "/",
      product,
    });
  });
};
