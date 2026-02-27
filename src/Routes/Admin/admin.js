const express = require("express");
const router = express.Router();
const adminController = require("../../Controllers/Admin/admin");

router.post("/register", adminController.register);
router.post("/createsubadmin", adminController.createsubadmin);
router.post("/login", adminController.login);
router.get("/getsubadmin", adminController.getsubadmin);
router.post("/editsubadmin/:id", adminController.editsubadmin);
router.delete("/deletesubadmin/:id", adminController.deletesubadmin);

module.exports = router;
