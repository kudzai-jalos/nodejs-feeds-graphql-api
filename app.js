require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      require("crypto").randomBytes(16).toString("hex") +
        "-" +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, ["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype));
};
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  next();
});

app.use(bodyParser.json()); // applicaiton/json
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// Import routes
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
// console.log(feedRoutes);

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error)
  const data = error.data;
  res.status(error.statusCode || 500).json({
    message: error.message,
    data,
    // errors: errors.array(),
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
