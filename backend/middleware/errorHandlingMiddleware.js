function errorHandlingMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  req.logger(
    JSON.stringify(
      {
        message: message,
        details: error,
      },
      null,
      5
    )
  );
  res.status(status).json({ message });
}

module.exports = errorHandlingMiddleware;
