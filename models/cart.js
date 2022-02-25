// const fs = require("fs");
// const path = require("path");
// const rootDir = require("../util/path");

// const Product = require("./product");
// const p = path.join(rootDir, "data", "cart.json");

// const getCartFromFile = (cb) => {
//   fs.readFile(p, (err, data) => {
//     if (err || !data) {
//       return cb([]);
//     }
//     cb(JSON.parse(data));
//   });
// };

// module.exports = class Cart {
//   static addProduct(id, productPrice, cb) {
//     // fetch old cart
//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 };

//       if (!err) {
//         cart = JSON.parse(fileContent);
//       }

//       // check if product exists
//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod.id === id
//       );
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.qty++;
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         updatedProduct = {
//           id,
//           qty: 1,
//         };
//         cart.products = [...cart.products, updatedProduct];
//       }

//       cart.totalPrice += +productPrice;

//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         if (err) {
//           console.log(err);
//         }
//         cb();
//       });
//     });

//     //
//   }

//   static remove(id, cb) {
//     Product.findById(id, (prod) => {
//       getCartFromFile((cart) => {
//         cart.products = cart.products.map((product) => {
//           if (product.id === id) {
//             cart.totalPrice -= prod.price;
//           }
//           return product.id === id
//             ? { ...product, qty: product.qty - 1 }
//             : product;
//         });
//         cart.products = cart.products.filter((product) => product.qty > 0);
//         fs.writeFile(p, JSON.stringify(cart), (err) => {
//           if (err) {
//             console.log("ERROR:", err);
//           }
//           cb();
//         });
//       });
//     });
//   }

//   static fetchCart(cb) {
//     getCartFromFile(cb);
//   }
// };

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart",{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
  }
});

module.exports = Cart;