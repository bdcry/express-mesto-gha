const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  CORRECT_CODE, CREATE_CODE, NOTFOUNDERROR, INTERNALSERVERERROR, BADREQUEST, UNATHORIZEDERROR,
} = require('../utils/codes');

module.exports.createUser = (req, res) => {
  const {
    email, name, about, avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(NOTFOUNDERROR).send({ message: 'Пользователи  не существуют' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getUsersId = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        res.status(NOTFOUNDERROR).send({ message: `Пользователь с указанным id:${userId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BADREQUEST).send({ message: `Неверно указан id пользователя:${userId}  ` });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.patchUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(CORRECT_CODE).send({ token });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(UNATHORIZEDERROR).send({ message: 'Ошибка аутентификации' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};
