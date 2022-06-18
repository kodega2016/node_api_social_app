const { check, validationResult } = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");

exports.validateLogin = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required.")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required.")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((e) => e["msg"])
        .join(",");
      return next(new ErrorResponse(message, 403));
    }
    next();
  },
];

exports.validateRegister = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Name can not be empty!")
    .bail(),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Body can not be empty!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password can not be empty!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((e) => e["msg"])
        .join(",");
      return next(new ErrorResponse(message, 403));
    }
    next();
  },
];
