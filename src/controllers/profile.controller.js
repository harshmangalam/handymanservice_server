const User = require("../models/user.model");
const { ACCESS_DENIED_ERR } = require("../errors");
exports.fetchAllUsers = async (req, res, next) => {
  try {
    let { limit, page, role } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let users;
    let count;

    users = await User.find({ role })
      .limit(limit)
      .skip(limit * page);
    count = await User.countDocuments({ role });

    return res.status(200).json({
      type: "success",
      message: "Fetch all users",
      data: {
        meta: {
          count,
        },
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchUserById = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    return res.status(200).json({
      type: "success",
      message: "Fetch  user by id",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    if (currentUser._id.toString() !== req.params.userId) {
      return next({ status: 401, message: ACCESS_DENIED_ERR });
    }

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    return res.status(200).json({
      type: "success",
      message: "User profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    if (currentUser._id.toString() !== req.params.userId) {
      return next({ status: 401, message: ACCESS_DENIED_ERR });
    }

    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({
      type: "success",
      message: "User account deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
