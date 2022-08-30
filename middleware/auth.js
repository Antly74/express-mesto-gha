const jwt = require('jsonwebtoken');
const { LoginError } = require('../utils/error');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new LoginError('Не авторизован!');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.clearCookie('jwt');
    throw new LoginError('Не авторизован');
  }

  req.user = payload;

  next();
};
