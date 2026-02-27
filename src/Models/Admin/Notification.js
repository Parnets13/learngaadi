const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema(
  {
    NotificationFor: { type: String },
    notification: {
      type: String,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", Notification);
module.exports = NotificationModel;
