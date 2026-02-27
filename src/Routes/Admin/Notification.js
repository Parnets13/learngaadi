const express = require("express");
const router = express.Router();
const Notificationcontroller = require("../../Controllers/Admin/Notification");

router.post("/addNotification", Notificationcontroller.addNotification);
router.get("/getNotification", Notificationcontroller.getNotification);
router.delete(
  "/deleteNotification/:id",
  Notificationcontroller.deleteNotification
);

module.exports = router;
