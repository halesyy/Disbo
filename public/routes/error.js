const notFoundHandler = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const errorHandler = (err, req, res, next) => {
  // Fallback to default express error handler if headers are sent
  if (res.headersSent) {
    return next(err);
  }

  // Set locals, only providing error in development
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (status >= 500) console.error(err);
  // Render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error', user: req.user, status });
  next();
};

module.exports = { notFound: notFoundHandler, error: errorHandler };
