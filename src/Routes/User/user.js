const express = require("express");
const router = express.Router();
const usercontroller = require("../../Controllers/User/user");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/Public/User");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/userSignup", upload.any(), usercontroller.UserSignup);
router.post("/userUpdate", upload.any(), usercontroller.userUpdate);
router.get("/userSignout/:id", usercontroller.userSignout);
router.get("/getalluser", usercontroller.getalluser);
router.get("/blockuser/:userid", usercontroller.userblock);
router.get("/unblockuser/:id", usercontroller.userunblock);
router.post("/editprofile", upload.any(), usercontroller.editprofile);

module.exports = router;
