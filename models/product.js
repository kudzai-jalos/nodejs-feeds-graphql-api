// // const rootDir = require("../util/path");

// // const p = path.join(rootDir, "data", "products.json");

// const db = require("../util/database");

// // const getProductsFromFile = (cb) => {
// //   fs.readFile(p, (err, data) => {
// //     if (err || !data) {
// //       return cb([]);
// //     }
// //     cb(JSON.parse(data));
// //   });
// // };

// module.exports = class Product {
//   constructor(title, imgUrl, description, price) {
//     this.title = title;
//     this.imgUrl = imgUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
//       [this.title, this.price, this.description, this.imgUrl]
//     );
//   }

//   static remove(id) {}

//   static update(id, title, imgUrl, description, price) {}

//   static fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//   }
// };

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.STRING,
  imageUrl: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Product;
