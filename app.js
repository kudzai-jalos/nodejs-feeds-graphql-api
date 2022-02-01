// import express module
const express = require('express');

// Create an express application
const app = express();

// Add middleware
app.use((req,res,next)=>{
  console.log("In the middleware!");
  next(); // Allow request to continue to the next middleware function
});

app.use((req,res,next)=>{
  console.log("In the 2nd middleware!!");
  // ....
  res.send("<h1>Request received.</h1>");
});

// Listen for incoming requests
app.listen(3000,()=>{
  console.log("Server running on port 3000");
})

