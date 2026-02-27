const CategoryModel = require("../../Models/Admin/Category");

class Category {
  async addCategory(req, res) {
    try {
      const catImage = req.files[0]?.filename;
      const { catName } = req.body;
      console.log("asxas", catImage, catName);
      if (!catImage) {
        return res.status(500).json({ error: "please provide Category image" });
      } else if (!catName) {
        return res.status(500).json({ error: "please provide Category name" });
      } else {
        const newCategory = await CategoryModel.create({
          catImage: catImage,
          catName: catName,
        });
        if (newCategory) {
          return res.status(201).json({ success: "new Category added..." });
        }
        return res
          .status(400)
          .json({ error: "Something went wrong!!! please try again" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCategory(req, res) {
    try {
      const CategoryList = await CategoryModel.find({});
      if (CategoryList?.length > 0) {
        return res.status(200).json({ CategoryList: CategoryList });
      }
      return res.status(400).json({ CategoryList: CategoryList });
    } catch (error) {
      console.log(error);
    }
  }

  async editCategory(req, res) {
    try {
      const Categoryid = req.params?.id;
      const catImage = req.files[0]?.filename;
      const { catName } = req.body;
      console.log(Categoryid, catImage, catName);

      const updated = {};
      if (catImage) {
        updated.catImage = catImage;
      }
      if (catName) {
        updated.catName = catName;
      }

      const isCategorypresent = await CategoryModel.findOne({
        _id: Categoryid,
      });
      if (!isCategorypresent) {
        return res.status(400).json({
          error: "Category is not present!!! Something went wrong",
        });
      }

      const editCategory = await CategoryModel.findOneAndUpdate(
        { _id: Categoryid },
        { $set: updated },
        { new: true }
      );
      if (!editCategory) {
        return res.status(400).json({
          error: "Category is not edited, please try again!!!",
        });
      }
      return res
        .status(200)
        .json({ success: "Category is edited successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const Categoryid = req.params?.id;
      if (!Categoryid) {
        return res.status(400).json({ error: "Please provide Category id" });
      }
      const deleteCategory = await CategoryModel.findOneAndDelete({
        _id: Categoryid,
      });
      if (!deleteCategory) {
        return res.status(400).json({ error: "Category is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Category is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}
const CategoryController = new Category();
module.exports = CategoryController;
