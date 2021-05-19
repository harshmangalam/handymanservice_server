const { validationResult } = require("express-validator");
const { STRIPE_SECRET_KEY } = require("../config");
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const stripe = require("stripe")(STRIPE_SECRET_KEY);

exports.createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ status: 422, message: "user input error", data: errors.mapped() });
    return;
  }
  try {
    const currentUser = res.locals.user;

    const service = await Service.findById(req.body.service);
    if (!service) {
      return next({ status: 404, message: "Service not found" });
    }
    const newBooking = new Booking({
      ...req.body,
      totalPrice: service.price,
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

exports.bookingPayment = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const { paymentId } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return next({ status: 404, message: "Booking not found" });
    }

    const payment = await stripe.paymentIntents.create(
      {
        amount: booking.totalPrice * 100,
        currency: booking.currency,
        payment_method: paymentId,
        description: `${currentUser.name} booking `,
        confirm: true,
        shipping: {
          name: currentUser.name,
          address: {
            line1: booking.address,
            postal_code: booking.postalCode,
            city: booking.city,
            state: booking.state,
            country: booking.country,
          },
        },
      },
      { idempotencyKey: booking._id }
    );

    await Booking.findByIdAndUpdate(req.params.bookingId, {
      isPaymentDone: true,
      paymentId,
    });

    return res.status(201).json({
      type: "success",
      message: "Payment done successfully",
      data: {
        payment,
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
