const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.json());// applicaiton/json

const feedRoutes = require("./routes/feed");

app.use((req,res,next)=>{
  res.set({
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET, POST, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers":"Content-Type, Authorization"
  });
  next();
});
app.use("/feed",feedRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080")
})