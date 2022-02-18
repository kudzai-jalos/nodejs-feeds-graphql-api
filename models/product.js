// const rootDir = require("../util/path");

// const p = path.join(rootDir, "data", "products.json");

const db = require("../util/database");

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, data) => {
//     if (err || !data) {
//       return cb([]);
//     }
//     cb(JSON.parse(data));
//   });
// };

module.exports = class Product {
  constructor(title, imgUrl, description, price) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imgUrl]
    );
  }

  static remove(id) {}

  static update(id, title, imgUrl, description, price) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
