require("dotenv").config();
const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("../node-js-academind/graphql/schema");
const graphqlResolvers = require("../node-js-academind/graphql/resolvers");
const isAuth = require("./middleware/is-auth");

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
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
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

const { clearImage } = require("./util/file");

app.use(isAuth);
app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided" });
  }
  if (req.body.oldPath) {
    console.log(req.body);
    clearImage(req.body.oldPath);
  }

  return res
    .status(201)
    .json({ message: "File stored", fileName: req.file.filename });
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      console.log(err.originalError);
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured.";
      const code = err.originalError.code || 500;
      return { message, status: code, data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const data = error.data;
  res.status(error.statusCode || 500).json({
    message: error.message,
    data,
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const server = app.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
