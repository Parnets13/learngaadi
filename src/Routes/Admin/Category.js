const express = require("express");
const router = express.Router();
const Categorycontroller = require("../../Controllers/Admin/Category");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/Public/Category");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addCategory", upload.any(), Categorycontroller.addCategory);
router.get("/getCategory", Categorycontroller.getCategory);
router.post("/editCategory/:id", upload.any(), Categorycontroller.editCategory);
router.delete("/deleteCategory/:id", Categorycontroller.deleteCategory);

module.exports = router;
