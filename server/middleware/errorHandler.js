export const errorHandler = (err, req, res, next) => {
  console.error('❌', err.stack || err.message);

  const status = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};
