const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    profilepic: { type: String },
    Aadharcard: { type: String },
    name: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    Address: {
      type: String,
    },
    Area: {
      type: String,
    },
    City: {
      type: String,
    },
    State: {
      type: String,
    },
    Country: {
      type: String,
    },
    Pincode: {
      type: Number,
    },
    blockstatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Online",
    },
    token: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", user);
module.exports = userModel;
