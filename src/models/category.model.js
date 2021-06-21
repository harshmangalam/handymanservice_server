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
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    },


    imagePublicId: String,

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
