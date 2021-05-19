const { model, Schema } = require("mongoose");

const categorySchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["accepted", "rejected", "completed"],
      default: "accepted",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    taskLength: {
      type: Number,
      default: 0,
    },

    instructions: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
    },

    address: {
      type: String,
      trim: true,
    },

    totalPrice: {
      type: Number,
    },

    currency: {
      type: String,
      enum: ["CAD", "USD"],
      default: "CAD",
    },
    paymentMode: {
      type: String,
      enum: ["COD", "ONLINE_PAYMENT"],
      default: "ONLINE_PAYMENT",
    },

    isPaymentDone: {
      type: Boolean,
      default: false,
    },

    paymentId: String,
  },

  { timestamps: true }
);

module.exports = model("Booking", categorySchema);
