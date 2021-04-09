const {
  EMAIL_ALREADY_EXISTS_ERR,
  PHONE_ALREADY_EXISTS_ERR,
} = require("../../errors");
const User = require("../../models/user.model");
const { hashPassword } = require("../../utils/password.util");

module.exports = async (req, res, next) => {
  try {
    let { email, phone, password, name, gender, role } = req.body;

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

    password = await hashPassword(password, next);

    // create new user
    const createUser = new User({
      email,
      phone,
      password,
      name,
      gender,
      role,
    });

    // save user

    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "You have registered successfully",
      data: {
        user,
      },

      //TODO: send otp to email

      //TODO: send otp to mobile number
    });
  } catch (error) {
    next(error);
  }
};
