const User = require("../models/user.model");
const cookie = require("cookie");
const { SUPER_EMAIL, SUPER_PASS } = require("../config");
const { validationResult } = require("express-validator");
const {
  PHONE_NOT_FOUND_ERR,
  INVALID_CREDENTIAL_ERR,
  EMAIL_ALREADY_EXISTS_ERR,
  PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  PHONE_INCORRECT_ERR,
} = require("../errors");

const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");

const { generateOTP, fast2sms } = require("../utils/otp.util");

// ------------------------- login with username ------------------------------

exports.loginWithUsername = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, message: "user input error", data: errors.mapped() });
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

    if (!user.isAccountVerified) {
      return res.status(201).json({
        type: "success",
        message: "Verify Your account",
        data: {
          user,
        },
      });
    }

    const token = createJwtToken({ userId: user._id });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    user.token = token;
    await user.save();
    return res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------ login with phone otp ----------------------------------

exports.loginWithPhoneOtp = async (req, res, next) => {
  try {
    //validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, message: "user input error", data: errors.mapped() });
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
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(4);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number

    // TODO: on in production
    return;
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};

// ------------------- login with phone otp verify -----------------------

exports.loginWithPhoneOtpVerify = async (req, res, next) => {
  try {
    //validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, message: "user input error", data: errors.mapped() });
      return;
    }

    const { otp, userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    if (user.phoneOtp != otp) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }

    user.phoneOtp = "";
    user.isAccountVerified = true;
    await user.save();

    const token = createJwtToken({ userId });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    user.token = token;
    await user.save();

    res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------login with facebook ----------------

exports.loginWithFacebook = async (req, res, next) => {
  try {
    let { name, email, accessToken, userId, profilePic, role } = req.body;
    const user = await User.findOne({
      email,
    });

    if (user) {
      const token = createJwtToken({ userId: user._id });

      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })
      );

      user.token = token;
      await user.save();

      return res.status(201).json({
        type: "success",
        message: "You have loggedin successfully",
        data: {
          user: user,
          loggedInBefore: true,
        },
      });
    } else {
      const password = await hashPassword("test123", next);
      const newUser = new User({
        name,
        email,
        profilePic,
        password,
        isAccountVerified: true,
        role,
      });

      let saveUser = await newUser.save();
      const token = createJwtToken({ userId: saveUser._id });

      newUser.token = token;
      saveUser = await newUser.save();

      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })
      );

      return res.status(201).json({
        type: "success",
        message: "You have loggedin successfully",
        data: {
          user: saveUser,
          loggedInBefore: false,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// --------------------- create new user ---------------------------------

exports.createNewUser = async (req, res, next) => {
  try {
    let { email, phone, password, name, role } = req.body;

    // check duplicate email
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }

    // check duplicate phone Number
    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
      return;
    }

    // hash password

    let hashed = await hashPassword(password, next);

    // create new user

    let createUser;

    if (SUPER_EMAIL === email && SUPER_PASS === password) {
      createUser = new User({
        email,
        phone,
        password: hashed,
        name,
        role: "SUPERUSER",
      });
    } else {
      createUser = new User({
        email,
        phone,
        password: hashed,
        name,
        role,
      });
    }

    // save user

    const user = await createUser.save();

    res.status(201).json({
      type: "success",
      message: "Registered successfully OTP sended to Phone number",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(4);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number

    // TODO: on in production

    return;
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------- verify otp -------------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp, userId } = req.body;

    const user = await User.findOne(userId.userId);
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    console.log(user)
    // verification of otp from phone

    if (user.phoneOtp != otp) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }

    

    user.phoneOtp = "";
    user.isAccountVerified = true;
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- send otp --------------------
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    let user = await User.findOne({ phone });

    if (!user) {
      next({ status: 404, message: PHONE_INCORRECT_ERR });
      return;
    }

    res.status(201).json({
      type: "success",
      message: "OTP sended successfully",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(4);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number
    return;
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};

// -------------- reset password  ----------------------

exports.resetPassword = async (req, res, next) => {
  try {
    let { newPassword, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      next({ status: 404, message: USER_NOT_FOUND_ERR });
      return;
    }

    newPassword = await hashPassword(newPassword, next);
    user.password = newPassword;
    user.isAccountVerified = true;
    await user.save();

    res.status(201).json({
      type: "success",
      message: "Password reset successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};

// --------- logout

exports.logoutUser = async (req, res, next) => {
  try {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    return res.status(200).json({
      type: "success",
      message: "You have log out successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};
