const { default: mongoose } = require("mongoose");
const {Schema} = require("mongoose");

const orderSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true,
  },
  items:[{title:{type:String,required:true},quantity:{type:Number,required:true}}]
});

const Order = mongoose.model("order",orderSchema);

module.exports = Order;

// // const { getDb } = require("../util/database");

// class Order  {
//   constructor (userId,items) {
//     this.userId = userId;
//     this.items = items;
//   }

//   save() {
//     const db = getDb();

//     return db.collection("orders").insertOne(this);
//   }

//   static findByUserId(userId) {
//     const db = getDb();

//     return db.collection("orders").find({userId}).toArray();
//   }
// }

// module.exports = Order;