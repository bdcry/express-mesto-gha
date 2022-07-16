const User = require('../models/user');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/correctcodes');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователи  не существуют' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getUsersId = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Пользователь с указанным id:${userId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Неверно указан id пользователя:${userId}  ` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
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
        res.status(400).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
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
        res.status(400).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};
