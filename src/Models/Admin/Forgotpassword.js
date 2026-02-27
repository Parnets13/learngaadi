const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Forgotpassword = new Schema(
  {
    email: {
      type: String,
    },
    EmailOtp: {
      type: String,
      required: true,
      maxlength: 6,
    },
    expire_at: {
      type: Date,
      expires: 60, // expiration time to 60 seconds
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ForgotpasswordModel = mongoose.model("Forgotpassword", Forgotpassword);
module.exports = ForgotpasswordModel;
