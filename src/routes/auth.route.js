const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { EMAIL_INCORRECT_ERR } = require("../errors");

const checkAuth = require("../middlewares/checkAuth");
const {
  createNewUser,
  loginWithPhoneOtp,
  loginWithPhoneOtpVerify,
  loginWithUsername,
  loginWithFacebook,
  sendOtp,
  verifyOtp,
  resetPassword,

  fetchCurrentUser,
  logoutUser,

} = require("../controllers/auth.controller");

const loginWithUsernameValidation = [
  body("username").not().isEmpty().withMessage("email/phone must be required"),

  body("password").not().isEmpty().withMessage("Password must be required"),
];

const loginWithPhoneOtpValidation = [
  body("phone").not().isEmpty().withMessage("Phone number must be required"),
];

const registerValidation = [
  body("fullName").not().isEmpty().withMessage("Name must be required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email address must be required")
    .isEmail()
    .withMessage(EMAIL_INCORRECT_ERR),
  body("phone").not().isEmpty().withMessage("Phone number must be required"),
];

router.post("/register", registerValidation, createNewUser);

router.post(
  "/login_with_username",
  loginWithUsernameValidation,
  loginWithUsername
);
router.post(
  "/login_with_phone_otp",
  loginWithPhoneOtpValidation,
  loginWithPhoneOtp
);

router.post("/login_with_facebook", loginWithFacebook);

router.get("/me", checkAuth, fetchCurrentUser);
router.post("/login_with_phone_otp/verify", loginWithPhoneOtpVerify);
router.post("/send_otp", sendOtp);
router.post("/verify_otp", verifyOtp);
router.post("/reset_password", resetPassword);
router.get("/logout", checkAuth, logoutUser);

module.exports = router;
