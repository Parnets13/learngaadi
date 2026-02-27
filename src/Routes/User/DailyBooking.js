const express = require("express");
const router = express.Router();
const DailyBookingcontroller = require("../../Controllers/User/DailyBooking");

router.post("/addDailyBooking", DailyBookingcontroller.addDailyBooking);
router.get("/getDailyBooking", DailyBookingcontroller.getDailyBooking);
router.get(
  "/getDailyBookingbyID/:id",
  DailyBookingcontroller.getDailyBookingbyID
);

router.get(
  "/getDailyBookingbyMainBookingID/:id",
  DailyBookingcontroller.getDailyBookingbyMainBookingID
);

router.delete(
  "/deleteDailyBooking/:id",
  DailyBookingcontroller.deleteDailyBooking
);
router.post("/AcceptDailyBooking", DailyBookingcontroller.AcceptDailyBooking);
router.post("/RejectDailyBooking", DailyBookingcontroller.RejectDailyBooking);
router.post("/updateDriverAddress", DailyBookingcontroller.updateDriverAddress);
router.post("/StartDailyBooking", DailyBookingcontroller.StartDailyBooking);
router.post(
  "/markAttendanceDailyBooking",
  DailyBookingcontroller.markAttendanceDailyBooking
);
router.post("/ExtendTraning", DailyBookingcontroller.ExtendTraning);
router.post("/StartTraining", DailyBookingcontroller.StartTraining);
router.post("/CompleteTraning", DailyBookingcontroller.CompleteTraning);
router.post("/Addreview", DailyBookingcontroller.Addreview);

module.exports = router;
