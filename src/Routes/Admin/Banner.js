const express = require("express");
const router = express.Router();
const Bannercontroller = require("../../Controllers/Admin/Banner");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/Public/Banner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addBanner", upload.any(), Bannercontroller.addBanner);
router.get("/getBanner", Bannercontroller.getBanner);
router.post("/editBanner/:id", upload.any(), Bannercontroller.editBanner);
router.delete("/deleteBanner/:id", Bannercontroller.deleteBanner);

module.exports = router;
