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
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "MALE",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "TASKER", "CUSTOMER"],
      default: "CUSTOMER",
    },

    profilePic: {
      type: String,
      trim: true,
    },
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
    isActive: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    blockNotification: {
      type: Boolean,
      default: false,
    },
    passwordResetEmailOtp: {
      type: String,
    },
    passwordResetPhoneOtp: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
