const { model, Schema } = require("mongoose");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default:
        "https://cdn.iconscout.com/icon/free/png-256/no-image-1771002-1505134.png",
    },

    imagePublicId: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["CAD", "USD"],
      default: "CAD",
    },
  },
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
