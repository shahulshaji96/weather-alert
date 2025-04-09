const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
};

module.exports = errorHandler;
