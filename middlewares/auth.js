const jwt = require('jsonwebtoken');
const UNATHORIZEDERROR = require('../utils/codes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовк

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNATHORIZEDERROR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен
  let payload;

  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UNATHORIZEDERROR)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
