const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

router.route("/add-product").get((req,res,next)=>{
  res.sendFile(path.join(rootDir,"views","add-product.html"));
}).post((req,res,next)=>{
  console.log(req.body);
  res.redirect('/');
});


module.exports = router;