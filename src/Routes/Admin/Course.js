const express = require("express");
const router = express.Router();
const Coursecontroller = require("../../Controllers/Admin/Course");

router.post("/addCourse", Coursecontroller.addCourse);
router.get("/getCourse", Coursecontroller.getCourse);
router.post("/editCourse/:id", Coursecontroller.editCourse);
router.delete("/deleteCourse/:id", Coursecontroller.deleteCourse);

module.exports = router;
