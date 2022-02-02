// import express module
const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Create an express application
const app = express();

// Add middleware

app.use(require('body-parser').urlencoded({extended:false}));

app.use("/admin",adminRoutes);
app.use(shopRoutes);

// Add 404
app.use((req,res,next)=>{
  res.status(404).send("<h1>Page not found.</h1>")
})
// Listen for incoming requests
app.listen(3000,()=>{
  console.log("Server running on port 3000");
})

