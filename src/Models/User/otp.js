const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otp = new Schema(
  {
    otp: {
      type: Number,
      required: true,
      maxlength: 6,
    },
    mobile: {
      type: Number,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
    },
    type: {
      type: String,
      // required: true,
      // maxlength: 50,
    },
    expire_at: {
      type: Date,
      expires: 60, // expiration time to 60 seconds
      default: Date.now,
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.model("otp", otp);
module.exports = otpModel;
