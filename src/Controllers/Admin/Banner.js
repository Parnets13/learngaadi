const BannerModel = require("../../Models/Admin/Banner");

class Banner {
  async addBanner(req, res) {
    try {
      const BannerImage = req.files[0]?.filename;
      const { BannerName } = req.body;
      console.log("asxas", BannerImage, BannerName);
      if (!BannerImage) {
        return res.status(500).json({ error: "please provide Banner image" });
      } else if (!BannerName) {
        return res.status(500).json({ error: "please provide Banner name" });
      } else {
        const newBanner = await BannerModel.create({
          BannerImage: BannerImage,
          BannerName: BannerName,
        });
        if (newBanner) {
          return res.status(201).json({ success: "new Banner added..." });
        }
        return res
          .status(400)
          .json({ error: "Something went wrong!!! please try again" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBanner(req, res) {
    try {
      const BannerList = await BannerModel.find({});
      if (BannerList?.length > 0) {
        return res.status(200).json({ BannerList: BannerList });
      }
      return res.status(400).json({ BannerList: BannerList });
    } catch (error) {
      console.log(error);
    }
  }

  async editBanner(req, res) {
    try {
      const Bannerid = req.params?.id;
      const BannerImage = req.files[0]?.filename;
      const { BannerName } = req.body;
      console.log(Bannerid, BannerImage, BannerName);

      const updated = {};
      if (BannerImage) {
        updated.BannerImage = BannerImage;
      }
      if (BannerName) {
        updated.BannerName = BannerName;
      }

      const isBannerpresent = await BannerModel.findOne({
        _id: Bannerid,
      });
      if (!isBannerpresent) {
        return res.status(400).json({
          error: "Banner is not present!!! Something went wrong",
        });
      }

      const editBanner = await BannerModel.findOneAndUpdate(
        { _id: Bannerid },
        { $set: updated },
        { new: true }
      );
      if (!editBanner) {
        return res.status(400).json({
          error: "Banner is not edited, please try again!!!",
        });
      }
      return res.status(200).json({ success: "Banner is edited successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBanner(req, res) {
    try {
      const Bannerid = req.params?.id;
      if (!Bannerid) {
        return res.status(400).json({ error: "Please provide Banner id" });
      }
      const deleteBanner = await BannerModel.findOneAndDelete({
        _id: Bannerid,
      });
      if (!deleteBanner) {
        return res.status(400).json({ error: "Banner is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Banner is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}
const BannerController = new Banner();
module.exports = BannerController;
