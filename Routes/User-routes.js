const express = require("express");

const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

const { auth } = require("../middleware/auth");
const { permit } = require("../middleware/authrization");

// router.get("/",auth, usersController.getUsers);
router.get("/", usersController.getUsers);

router.post(
  "/register",

  check("username").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength(
    { min: 6 },
    check("age").not().isEmpty(),
    check("gender").not().isEmpty()
  ),

  usersController.signup
);

router.post("/login", usersController.login);
// router.get("/logout", usersController.logout);
router.delete("/:userId", usersController.deleteUsers);
// router.post ('/edit', usersControllers)
router.get("/editUser/:userId", usersController.editUser);
router.put("/updateUser/:userId", usersController.updateUser);
// add guadians
router.post("/addGuardian/:userId", usersController.addGuardian);
//location
router.post("/location/:userId", usersController.location);
// safety Tips
router.post("/safetyTips", usersController.addSafetyTips);
//show safetyTips
router.get("/safetyTips", usersController.showSafetyTips);
//delete safetyTips
router.delete("/safetyTips/:tipId", usersController.deleteTips);
router.put("/safetyTips/:tipId", usersController.updateTip);

//get reported locations
router.get("/reportedLocations", usersController.showReportedLocations);
//user reporting sending location
router.post("/reportLocation/:userId", usersController.reportLocations);
//admin action on reported location
router.put("/reportedLocation/:locId", usersController.reportedLocationAction);
//admin deleting reported location
router.delete(
  "/reportedLocation/:locId",
  usersController.deleteReportedLocation
);

module.exports = router;
