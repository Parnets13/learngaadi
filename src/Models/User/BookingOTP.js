const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingOTP = new Schema(
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
      default: Date.now,
      expires: 60,
    },
  },
  { timestamps: true }
);

const BookingOTPModel = mongoose.model("BookingOTP", BookingOTP);
module.exports = BookingOTPModel;
