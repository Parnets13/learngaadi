const express = require("express");
const router = express.Router();
const BookingOTPController = require("../../Controllers/User/BookingOTP");

router.post("/sendBookingOTP", BookingOTPController.sendBookingOTP);
router.post("/verifyBookingOTP", BookingOTPController.verifyBookingOTP);

module.exports = router;
