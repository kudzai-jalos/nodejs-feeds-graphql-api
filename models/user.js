const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");
const Product = require("./product");

class User {
  constructor(id, username, email, cart) {
    this.email = email;
    this.username = username;
    this.cart = cart; // {items:[]}
    if (id) this._id = new ObjectId(id);
  }

  clearCart() {
    this.cart.items = [];
    return this.updateTotalPrice();
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        this._id = new ObjectId(result.insertedId);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let updatedCart;
    if (cartProductIndex >= 0) {
      updatedCart = { ...this.cart };
      updatedCart.items[cartProductIndex].quantity += 1;
    } else {
      updatedCart = {
        ...this.cart,
        items: [...this.cart.items, { productId: product._id, quantity: 1 }],
      };
    }
    const totalPrice = updatedCart.items.reduce((total, cp) => {
      return total + cp.price * cp.quantity;
    }, 0);
    updatedCart.totalPrice = totalPrice;
    this.cart = updatedCart;

    return this.updateTotalPrice();
  }

  removeFromCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let updatedCart = { ...this.cart };
    updatedCart.items[cartProductIndex].quantity -= 1;

    if (updatedCart.items[cartProductIndex].quantity <= 0) {
      updatedCart.items = updatedCart.items.filter(
        (cp) => product._id.toString() !== cp._id.toString()
      );
    }
    this.cart = updatedCart;

    return this.updateTotalPrice();
  }

  updateTotalPrice() {
    return Product.fetchAll()
      .then((products) => {
        const totalPrice = this.cart.items.reduce((total, cp) => {
          const product = products.find(
            (prod) => prod._id.toString() === cp.productId.toString()
          );
          return total + product.price * cp.quantity;
        }, 0);
        this.cart.totalPrice = totalPrice;
        const db = getDb();
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
