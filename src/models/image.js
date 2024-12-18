const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // unique: true
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

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;