const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Title must be less than 50 characters"],
    minlength: [5, "Title must be at least 5 characters"],
    unique: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, "Body must be less than 2000 characters"],
    minlength: [5, "Body must be at least 5 characters"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photo: {
    type: String,
    default: "no-photo.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
