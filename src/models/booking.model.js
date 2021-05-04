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
      enum: ["accepted", "rejected"],
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
    address: {
      type: String,
      trim: true,
    },
  },

  { timestamps: true }
);

module.exports = model("Booking", categorySchema);
