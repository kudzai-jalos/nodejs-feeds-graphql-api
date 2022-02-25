// import express module
const express = require("express");

const errorController = require("./controllers/error");
const Cart = require("./models/cart");
const CartItem = require("./models/CartItem");
const Product = require("./models/product");
const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// Create an express application
const app = express();

// Initialize database and models
const sequelize = require("./util/database");

User.hasMany(Product);
Product.belongsTo(User);
User.hasOne(Cart);
Product.belongsToMany(Cart,{through:CartItem});
Cart.belongsToMany(Product,{through:CartItem})
// Config
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
app.set("view engine", "ejs");
// app.set("views","views")

//********Add middleware*******
app.use(express.static("public"));

app.use(require("body-parser").urlencoded({ extended: false }));

app.use((req,res,next)=>{
  User.findByPk(1).then((user)=>{
    req.user=user;
    next();
  });

});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Add 404
app.use(errorController.get404);
// Listen for incoming requests

sequelize
  .sync() // {force:true}
  .then(() => {
    return User.findByPk(1);
  }).then((user)=>{
    if (!user) {
      return User.create({
        username:"kudzai",
        email:"kudzaijalos@gmail.com"
      })
    }
    return Promise.resolve(user);
  }).then(user=>{
    app.listen(3000,()=>{
      console.log("Server running on port 3000");
    })
  })
  .catch((err) => console.log(err));
