const Slider = require("../models/sliders.model");

exports.fetchHomeSliders = async (req, res, next) => {
  try {
    const homeSliders = await Slider.find();
    return res.status(200).json({
      type: "success",
      message: "fetch all sliders",
      data: {
        sliders: homeSliders,
      },
    });
  } catch (error) {
    next(error);
  }
};
