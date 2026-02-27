const express = require("express");
const router = express.Router();
const otpController = require("../../Controllers/User/otp");

router.post("/usersendotp", otpController.usersendotp);
router.post("/verifyotp", otpController.verifyotp);
router.post("/resetpassword", otpController.resetpassword);

module.exports = router;
