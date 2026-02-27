const express = require("express");
const router = express.Router();
const drivercontroller = require("../../Controllers/Driver/driver");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/Public/Driver");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/driverSignup", upload.any(), drivercontroller.driverSignup);
router.post("/driverUpdate1", drivercontroller.driverUpdate1);
router.post("/driverUpdate2", upload.any(), drivercontroller.driverUpdate2);
router.post("/driverUpdate3", drivercontroller.driverUpdate3);
router.get("/driverSignout/:id", drivercontroller.driverSignout);
router.get("/getalldriver", drivercontroller.getalldriver);
router.get("/blockdriver/:driverid", drivercontroller.driverblock);
router.get("/unblockdriver/:id", drivercontroller.driverunblock);
router.post("/editprofile", upload.any(), drivercontroller.editprofile);
router.post("/editduty", drivercontroller.editduty);
router.delete("/deleteDriver/:id", drivercontroller.deleteDriver);

module.exports = router;
