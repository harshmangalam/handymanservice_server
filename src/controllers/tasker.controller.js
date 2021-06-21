const User = require("../models/user.model");

const Tasker = require("../models/tasker.model");

exports.fetchTaskerHomeData = async (req, res, next) => {
  try {
    return res.status(200).json({
      type: "success",
      message: "fetch tasker home page data",
    });
  } catch (error) {
    next(error);
  }
};
