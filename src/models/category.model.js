const { model, Schema } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://cdn.iconscout.com/icon/free/png-256/no-image-1771002-1505134.png",
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
