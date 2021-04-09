const User = require("../../models/user.model");

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

exports.fetchAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      type: "success",
      message: "fetch all users",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    return res.status(200).json({
      type: "success",
      message: "fetch all users",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
