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
    .getCart({ include: Product })
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
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        newQuantity += product.cartItem.quantity;
        return Promise.resolve(product);
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.findByPk(productId)
  //   .then((product) => {
  //     Cart.addProduct(product.id, product.price, () => {
  //       res.redirect("/cart");
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postRemoveCartItem = (req, res, next) => {
  const { productId } = req.params;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(([product]) => {
      if (product.cartItem.quantity === 1) {
        return fetchedCart.removeProduct(product);
      }
      const newQuantity = product.cartItem.quantity - 1;
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.findById(productId, (product) => {
  //   Cart.remove(product.id, () => {
  //     res.redirect("/cart");
  //   });
  // });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: Product })
    .then((orders) => {
      console.log(orders[0].products);
      res.render("shop/orders", {
        docTitle: "My Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCheckout = (req, res, next) => {
  let fetchedCart;
  let fetchedProducts;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then((order) => {
      const promises = [];
      for (let i = 0; i < fetchedProducts.length; i++) {
        promises.push(
          order.addProduct(fetchedProducts[i], {
            through: { quantity: fetchedProducts[i].cartItem.quantity },
          })
        );
      }
      return Promise.all(promises);
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
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
