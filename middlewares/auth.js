const jwt = require('jsonwebtoken');
const NotAutErr = require('../errors/not-aut-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('1')
    throw new NotAutErr('Необходима авторизация');
  }

  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
//dev-secret
  } catch (err) {
    throw new NotAutErr('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
