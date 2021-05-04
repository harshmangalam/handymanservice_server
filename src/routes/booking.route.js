const router = require("express").Router();
const checkAuth = require("../middlewares/checkAuth");
const {
  fetchAllBooking,
  fetchBookingById,
  createBooking,
  updateBooking,
  removeBooking,
  fetchMyBookings,
} = require("../controllers/booking.controller");
const { body } = require("express-validator");

const bookingValidation = [
  body("address")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address must be required"),
  body("city").trim().not().isEmpty().withMessage("city must be required"),
  body("taskLength")
    .trim()
    .not()
    .isEmpty()
    .withMessage("task length must be required"),
];
router.get("/", fetchAllBooking);
router.get("/my_bookings", checkAuth, fetchMyBookings);
router.get("/:bookingId", fetchBookingById);
router.post("/", checkAuth, createBooking);
router.put("/:bookingId", checkAuth, updateBooking);
router.delete("/:bookingId", checkAuth, removeBooking);

module.exports = router;
