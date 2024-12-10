const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    profilePicture: {
        data: Buffer,
        contentType: String, // e.g., 'image/png', 'image/jpeg'
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("imageSchema", imageSchema);
module.exports = Image;