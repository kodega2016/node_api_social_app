const { check, validationResult } = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");

exports.validateSavePost = [
  check("title").trim().not().isEmpty().withMessage("Title is required."),
  check("body").not().isEmpty().withMessage("Body is required."),

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
