const { handleServerError } = require("./error");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  // Product.findAll()
  Product.find()
    .then((products) => {
      res.render("shop/products", {
        docTitle: "Shop",
        path: "/",
        products,
        hasProducts: products.length > 0,
        activeShop: true,
        shopCSS: true,
      });
    })
    .catch((err) => handleServerError(err,next));
};

exports.getProducts = (req, res, next) => {
  // req.user
  //   .getProducts()
  Product.find()
    .then((products) => {
      // console.table(products);
      res.render("shop/products", {
        docTitle: "Products",
        path: "/products",
        products,
        hasProducts: products.length > 0,
        activeShop: true,
        shopCSS: true,
      });
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    res.render("shop/cart", {
      docTitle: "My Cart",
      path: "/cart",
      products: user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          ...item.productId._doc,
        };
      }),
      totalPrice: user.cart.totalPrice,
    });
  });
  // Product.find()
  //   .then((products) => {

  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      // const user = new User(
      //   req.user._id,
      //   req.user.username,
      //   req.user.email,
      //   req.user.cart || { items: [], totalPrice: 0 }
      // );

      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};

exports.postRemoveCartItem = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "My Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};

exports.postCheckout = (req, res, next) => {
  let items;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      items = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          ...item.productId._doc,
        };
      });
      console.log(items);

      const order = new Order({userId:user._id, items});

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};

exports.getProductDetails = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        docTitle: product.title,
        path: "/",
        product,
      });
    })
    .catch((err) => {
      handleServerError(err,next)
    });
};
