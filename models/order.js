const { getDb } = require("../util/database");

class Order  {
  constructor (userId,items) {
    this.userId = userId;
    this.items = items;
  }

  save() {
    const db = getDb();

    return db.collection("orders").insertOne(this);
  }

  static findByUserId(userId) {
    const db = getDb();

    return db.collection("orders").find({userId}).toArray();
  }
}

module.exports = Order;