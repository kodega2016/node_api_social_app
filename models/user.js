const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name must be less than 50 characters"],
      minlength: [5, "Name must be at least 5 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: [50, "Email must be less than 50 characters"],
      minlength: [5, "Email must be at least 5 characters"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    update: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//encrypt password before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    user.password = hash;
  }
  next();
});

//match password
userSchema.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//get jwt token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//populate posts
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
