const { Schema, model } = require("mongoose");

const pageSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Page", pageSchema);
