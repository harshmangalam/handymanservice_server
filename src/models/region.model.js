const { model, Schema } = require("mongoose");

const regionSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = model("Region", regionSchema);
