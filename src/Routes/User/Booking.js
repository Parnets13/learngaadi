const express = require("express");
const router = express.Router();
const Bookingcontroller = require("../../Controllers/User/Booking");

router.post("/addBooking", Bookingcontroller.addBooking);
router.get("/getBooking", Bookingcontroller.getBooking);
router.get(
  "/getBookingbyCustomerID/:id",
  Bookingcontroller.getBookingbyCustomerID
);
router.delete("/deleteBooking/:id", Bookingcontroller.deleteBooking);
router.post("/AcceptBooking", Bookingcontroller.AcceptBooking);
router.post("/RejectBooking", Bookingcontroller.RejectBooking);
router.post("/StartTraning", Bookingcontroller.StartTraning);
// router.post("/markAttendance", Bookingcontroller.markAttendance);
// router.post("/ExtendTraning", Bookingcontroller.ExtendTraning);

module.exports = router;
