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
  Product.remove(productId, () => {
    console.log("deleting:", productId);
    res.redirect("/admin/products");
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        docTitle: "Shop",
        path: "/",
        products: rows,
        hasProducts: rows.length > 0,
        activeShop: true,
        shopCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        docTitle: "Admin Product",
        path: "/admin/products",
        products: rows,
        isAdmin: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    Cart.fetchCart((cart) => {
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        cartItems: cart.products.map((cartItem) => {
          const product = products.find((prod) => cartItem.id === prod.id);
          return {
            ...cartItem,
            title: product.title,
            price: product.price,
          };
        }),
        totalPrice: cart.totalPrice,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, product.price, () => {
      res.redirect("/cart");
    });
  });
};

exports.postRemoveCartItem = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId, (product) => {
    Cart.remove(product.id, () => {
      res.redirect("/cart");
    });
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
  const { productId } = req.params;
  Product.findById(productId)
    .then(([rows, fieldData]) => {
      res.render("shop/product-details", {
        docTitle: rows[0].title,
        path: "/",
        product: rows[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
