const { validationResult } = require("express-validator");
const Booking = require("../models/booking.model");

exports.createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ status: 422, message: "user input error", data: errors.mapped() });
    return;
  }
  try {
    const currentUser = res.locals.user;
    const newBooking = new Booking({
      ...req.body,
      user: currentUser._id,
    });

    const saveBooking = await newBooking.save();

    return res.status(201).json({
      type: "success",
      message: "You have booked a services successfully",
      data: {
        bookingId: saveBooking._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      req.body,
      {
        new: true,
      }
    )

      .populate("user", "-password -phoneOtp")
      .populate({
        path: "service",
        populate: [
          { path: "creator", select: "-password -phoneOtp" },
          { path: "category" },
        ],
      });
    return res.status(201).json({
      type: "success",
      message: " booking  service updated successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);

    return res.status(201).json({
      type: "success",
      message: "booking  removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAllBooking = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "-password -phoneOtp")
      .populate({
        path: "service",
        populate: [
          { path: "creator", select: "-password -phoneOtp" },
          { path: "category" },
        ],
      });

    return res.status(200).json({
      type: "success",
      message: "all bookings",
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchMyBookings = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { status } = req.query;
    let bookings;

    if (status) {
      bookings = await Booking.find({ user: currentUser._id, status })
        .populate("user", "-password -phoneOtp")
        .populate({
          path: "service",
          populate: [
            { path: "creator", select: "-password -phoneOtp" },
            { path: "category" },
          ],
        });
    } else {
      bookings = await Booking.find({ user: currentUser._id })
        .populate("user", "-password -phoneOtp")
        .populate({
          path: "service",
          populate: [
            { path: "creator", select: "-password -phoneOtp" },
            { path: "category" },
          ],
        });
    }

    return res.status(200).json({
      type: "success",
      message: "all my bookings",
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user", "-password -phoneOtp")
      .populate({
        path: "service",
        populate: [
          { path: "creator", select: "-password -phoneOtp" },
          { path: "category" },
        ],
      });

    return res.status(200).json({
      type: "success",
      message: "fetch booking by id",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};
