const express = require("express");
const { body } = require("express-validator");
const route = express.Router();
const { EMAIL_INCORRECT_ERR } = require("../errors");

const registerUser = require("../controllers/auth/register.controller");
const {
  loginWithPhoneOtp,
  loginWithUsername,
} = require("../controllers/auth/login.controller");

const loginWithUsernameValidation = [
  body("username").not().isEmpty().withMessage("email/phone must be required"),

  body("password").not().isEmpty().withMessage("Password must be required"),
];

const loginWithPhoneOtpValidation = [
  body("phone")
    .not()
    .isEmpty()
    .withMessage("Phone number must be required")
    .isMobilePhone("en-IN"),
];

const registerValidation = [
  body("fullName").not().isEmpty().withMessage("Name must be required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email address must be required")
    .isEmail()
    .withMessage(EMAIL_INCORRECT_ERR),
  body("phone")
    .not()
    .isEmpty()
    .withMessage("Phone number must be required")
    .isMobilePhone("en-IN"),
];

route.post("/register", registerValidation, registerUser);
route.post(
  "/login_with_username",
  loginWithUsernameValidation,
  loginWithUsername
);
route.post(
  "/login_with_phone_otp",
  loginWithPhoneOtpValidation,
  loginWithPhoneOtp
);

module.exports = route;
