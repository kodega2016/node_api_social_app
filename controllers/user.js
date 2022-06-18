const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/user");
const ErrorResponse = require("../utils/ErrorResponse");

exports.index = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
    message: "Users fetched successfully",
  });
});

exports.show = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("posts");

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
    message: "User fetched successfully",
  });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  //update user
  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      password,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: user,
    message: "User updated successfully",
  });
});

exports.destroy = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
    message: "User deleted successfully",
  });
});
