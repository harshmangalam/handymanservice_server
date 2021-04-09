const User = require("../../models/user.model");
const { validationResult } = require("express-validator");
const { PHONE_NOT_FOUND_ERR, INVALID_CREDENTIAL_ERR } = require("../../errors");

const { checkPassword } = require("../../utils/password.util");
const { createJwtToken } = require("../../utils/token.util");

exports.loginWithUsername = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, message:"user input error",data: errors.mapped() });
      return;
    }

    const { username, password } = req.body;

    // verify username  -> email or phone

    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });
    if (!user) {
      next({ status: 400, message: INVALID_CREDENTIAL_ERR });
      return;
    }

    // verify password

    const matchPassword = await checkPassword(password, user.password, next);
    if (!matchPassword) {
      next({ status: 400, message: INVALID_CREDENTIAL_ERR });
      return;
    }

    // send jwt token

    const token = createJwtToken({ userId: user._id });

    res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginWithPhoneOtp = async (req, res, next) => {
  try {
    //validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, message:"user input error",data: errors.mapped() });
      return;
    }

    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: PHONE_NOT_FOUND_ERR });
      return;
    }

    res.status(201).json({
      type: "success",
      message: "OTP sended to your registered phone number",
      data: {
        user: user,
      },
    });

    // TODO: send otp to registered mobile number
    
  } catch (error) {
    next(error);
  }
};
