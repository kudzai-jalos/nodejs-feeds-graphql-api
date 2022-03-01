const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.getShop = (req, res, next) => {
  // Product.findAll()
  Product.fetchAll()
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
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // req.user
  //   .getProducts()
  Product.fetchAll()
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
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products: req.user.cart.items.map((cp) => {
          const product = products.find(
            (prod) => prod._id.toString() === cp.productId.toString()
          );
          return { ...product, quantity: cp.quantity };
        }),
        totalPrice: req.user.cart.totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      const user = new User(
        req.user._id,
        req.user.username,
        req.user.email,
        req.user.cart || { items: [], totalPrice: 0 }
      );

      return user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postRemoveCartItem = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      const user = new User(
        req.user._id,
        req.user.username,
        req.user.email,
        req.user.cart || { items: [], totalPrice: 0 }
      );

      return user.removeFromCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  let fetchedProducts;
  Product.fetchAll()
    .then((products) => {
      fetchedProducts = products;
      return Order.findByUserId(req.user._id);
    })
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "My Orders",
        path: "/orders",
        orders: orders.map((order) => {
          const productIds = order.items.map((item) =>
            item.productId.toString()
          );
          const products = fetchedProducts
            .filter((prod) => {
              return productIds.includes(prod._id.toString());
            })
            .map((product) => {
              return {
                ...product,
                quantity: order.items.find(
                  (item) => product._id.toString() === item.productId.toString()
                ).quantity,
              };
            });
          console.log("order data ->", {
            _id: order._id,
            products,
          });
          return {
            ...order,
            products,
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCheckout = (req, res, next) => {
  const order = new Order(req.user._id, req.user.cart.items);

  order
    .save()
    .then((result) => {
      const user = new User(
        req.user._id,
        req.user.username,
        req.user.email,
        req.user.cart || { items: [], totalPrice: 0 }
      );
      return user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
    });
};
