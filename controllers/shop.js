const { handleServerError } = require("./error");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

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
    .catch((err) => handleServerError(err, next));
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
      handleServerError(err, next);
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
      handleServerError(err, next);
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
      handleServerError(err, next);
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
      handleServerError(err, next);
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

      const order = new Order({ userId: user._id, items });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      handleServerError(err, next);
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
      handleServerError(err, next);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  
  Order.findOne({ _id: orderId })
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      } else if (order.userId.toString() === req.user._id.toString()) {
        // fs.readFile(pathName,(err,data)=>{
        //   if (err) {
        //     return next(err);
        //   }
        //   res.set({
        //     "Content-Type":"application/pdf",
        //     'Content-Disposition':'inline; filename="'+invoiceName+'"'
        //   });
        //   res.send(data);
        //  })
        const invoiceName = "invoice-" + orderId + ".pdf";
        const pathName = path.join("data", "invoices", invoiceName);
        const pdfDoc = new PDFDocument();
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="' + invoiceName + '"',
        });
        pdfDoc.pipe(fs.createWriteStream(pathName));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(24).text("Invoice",{
          underline:true,
          align:"center",
        });

        // pdfDoc.text("Title    Quantity    Price")
        let totalPrice = 0;
        order.items.forEach(prod=>{
          totalPrice+=prod.price*prod.quantity;
          pdfDoc.fontSize(14).text(`${prod.title}    x${prod.quantity}    $${prod.price}`)
        })
        pdfDoc.text("___");
        pdfDoc.fontSize(16).fillColor("#333").text("Total: $"+totalPrice)
        pdfDoc.end();
        // const file = fs.createReadStream(pathName);
        
        // file.pipe(res);
      } else {
        return next(new Error("Unauthorized"));
      }
    })
    .catch((err) => {
      next(err);
    });
};
