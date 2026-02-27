const express = require("express");
const router = express.Router();
const ForgotpasswordController = require("../../Controllers/Admin/Forgotpassword");

router.post("/sendOtp", ForgotpasswordController.sendOtp);
router.post("/VerifyOtp", ForgotpasswordController.VerifyOtp);
router.post("/ChangePassword", ForgotpasswordController.ChangePassword);

module.exports = router;
