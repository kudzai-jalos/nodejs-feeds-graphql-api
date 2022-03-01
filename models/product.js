const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class Product {
  constructor(title, imageUrl, description, price,userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }

  save() {
    const db = getDb();

    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static remove(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static update(id, updateData) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { ...updateData },
          $currentDate: { lastModified: true },
        }
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();

    return db.collection("products").find().toArray();
  }

  static findById(id) {
    const db = getDb();

    return db.collection("products").findOne({ _id: new ObjectId(id) });
  }
};

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: Sequelize.STRING,
//   imageUrl: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
// });

// module.exports = Product;
