const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message || "Something went wrong";
  error.statusCode = err.statusCode || 500;

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message,
    data: null,
  });
};
module.exports = errorHandler;
