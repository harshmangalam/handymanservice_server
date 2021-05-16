const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Category = require("../models/category.model");
const Region = require("../models/region.model");
const Page = require("../models/page.model");

exports.countDocuments = async (req, res, next) => {
  try {
    const admin = await User.countDocuments({ role: "ADMIN" });
    const customer = await User.countDocuments({ role: "CUSTOMER" });
    const tasker = await User.countDocuments({ role: "TASKER" });

    const booking = await Booking.estimatedDocumentCount();
    const service = await Service.estimatedDocumentCount();
    const category = await Category.estimatedDocumentCount();
    const region = await Region.estimatedDocumentCount();
    const page = await Page.estimatedDocumentCount();

    const count = {
      admin,
      customer,
      tasker,
      booking,
      service,
      category,
      region,
      page
    };
    return res.status(200).json({
      type: "success",
      message: "Fetch all users",
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
