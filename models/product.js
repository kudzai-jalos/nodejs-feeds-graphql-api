const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err || !data) {
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(title, imgUrl, description, price) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log("ERROR:", err);
        }
      });
    });
  }

  static remove(id,cb) {
    getProductsFromFile((products) => {
      console.log("before",products);
      products = products.filter((product) => product.id !== id);
      console.log("After",products);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log("ERROR:", err);
        }
        cb();
      });
    });
  }

  static update(id, title, imgUrl, description, price,cb) {
    getProductsFromFile((products) => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (products[productIndex]) {
        products[productIndex] = {
          ...products[productIndex],
          title,
          imgUrl,
          description,
          price,
        };
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log("ERROR:", err);
          }
        });
      } else {
        console.log("Product not found");
      }
      cb();
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      cb(products.find((product) => product.id === id));
    });
  }
};
