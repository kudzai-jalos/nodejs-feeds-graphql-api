const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getShop = (req, res, next) => {
  Product.findAll()
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
  req.user
    .getProducts()
    .then((products) => {
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
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      return cart.getProducts();
    })
    .then((products) => {
      console.log(products);
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products,
        totalPrice: 0,
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll((products) => {
  //   Cart.fetchCart((cart) => {
  //     res.render("shop/cart", {
  //       docTitle: "My Cart",
  //       path: "/cart",
  //       cartItems: cart.products.map((cartItem) => {
  //         const product = products.find((prod) => cartItem.id === prod.id);
  //         return {
  //           ...cartItem,
  //           title: product.title,
  //           price: product.price,
  //         };
  //       }),
  //       totalPrice: cart.totalPrice,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      Cart.addProduct(product.id, product.price, () => {
        res.redirect("/cart");
      });
    })
    .catch((err) => console.log(err));
};

exports.postRemoveCartItem = (req, res, next) => {
  const { productId } = req.params;

  // Product.findById(productId, (product) => {
  //   Cart.remove(product.id, () => {
  //     res.redirect("/cart");
  //   });
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "My Orders",
    path: "/orders",
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };

exports.getProductDetails = (req, res, next) => {
  const { productId } = req.params;
  Product.findByPk(productId)
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
