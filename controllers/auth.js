const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/user");

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    data: { token, ...user._doc },
  });
});

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //check if email is already in use
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorResponse(`Email ${email} is already in use`, 400));
  }
  user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: user,
    message: "User fetched successfully",
  });
});

exports.logout = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: null,
    message: "User logged out successfully",
  });
};
