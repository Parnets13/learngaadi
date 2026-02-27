const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Banner = new Schema(
  {
    BannerName: { type: String },
    BannerImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", Banner);
module.exports = BannerModel;
