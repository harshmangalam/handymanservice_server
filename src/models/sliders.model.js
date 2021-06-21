const { Schema, model } = require("mongoose");

const sliderSchema = new Schema(
  {
    homeSliders: [
      {
        heading: {
          type: String,
          trim: true,
        },
        text: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Slider", sliderSchema);
