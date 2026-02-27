const express = require("express");
const router = express.Router();
const OtpLoginController = require("../../Controllers/Driver/OtpLogin");

router.post("/sendotp", OtpLoginController.sendotp);
router.post("/verifyotp", OtpLoginController.verifyotp);
router.post("/resetpassword", OtpLoginController.resetpassword);

module.exports = router;
