const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userScema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

const User = mongoose.model("user", userScema);

module.exports = User;
