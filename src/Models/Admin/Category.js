const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    catName: { type: String },
    catImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", Category);
module.exports = CategoryModel;
