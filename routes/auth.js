const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/auth");
const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid Email Address"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("password  should  be 8 characters long"),
  ],
  UserController.signup
);

router.post("/login", UserController.login);
module.exports = router;
