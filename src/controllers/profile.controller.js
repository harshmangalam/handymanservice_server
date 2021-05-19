const User = require("../models/user.model");
const Booking = require("../models/booking.model");

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

exports.fetchUserProfileDetail = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    let user = await User.findById(currentUser._id);
    let completedBookings = await Booking.countDocuments({
      user: currentUser._id,
      status: "completed",
    });
    let acceptedBookings = await Booking.countDocuments({
      user: currentUser._id,
      status: "accepted",
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch  user by id",
      data: {
        user,
        bookings: [
          {
            title: "Accepted Bookings",
            count: acceptedBookings,
          },
          {
            title: "Completed Bookings",
            count: completedBookings,
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
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
