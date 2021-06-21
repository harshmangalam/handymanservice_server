const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "TASKER", "CUSTOMER", "SUPERUSER"],
      default: "CUSTOMER",
    },

    profilePic: {
      type: String,
      trim: true,
    },

    profilePicPublicId: String,
    addresses: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      lat: String,
      lng: String,
      city: String,
      pinCode: String,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    phoneOtp: String,

    blockNotification: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    socketId: String,
    token: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
