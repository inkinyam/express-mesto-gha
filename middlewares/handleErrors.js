const handleErrors = (err, req, res, next) => {
  let { message } = err;
  const { statusCode = 500 } = err;

  if (statusCode === 500) {
    message = 'На сервере произошла ошибка';
  }

  res.status(statusCode).send(message);
  next();
};

module.exports = handleErrors;
