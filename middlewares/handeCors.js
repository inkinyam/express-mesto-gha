const allowedCors = [
  'https://inkinyam.nomoredomains.sbs',
  'http://51.250.65.30',
  'localhost:3000',
];

// обработка CORS запросов
const handleCors = (req, res, next) => {
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  if (allowedCors.includes(origin)) {
    return res.header('Access-Control-Allow-Origin', origin);
  }
  return next();
};

module.exports = handleCors;
