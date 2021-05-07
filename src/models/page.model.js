const { Schema, model } = require("mongoose");

const pageSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
  },
  { timestamps: true }
);

module.exports = model("Page", pageSchema);
