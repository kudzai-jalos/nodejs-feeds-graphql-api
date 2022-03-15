const fs = require("fs");
const path = require("path");
const rootDir = require("./path");

exports.clearImage = (imagePath) => {
  const filePath = path.join(rootDir, "images", imagePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};


