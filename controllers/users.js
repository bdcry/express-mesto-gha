const User = require('../models/user');

const NotFoundError = require('../utils/errorcodes/not-found-error');
const InternalServerError = require('../utils/errorcodes/internal-server-error');
const BadRequestError = require('../utils/errorcodes/bad-request-error');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/correctcodes');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Данные не прошли валидацию на сервере'));
      }
      next(new InternalServerError('Ошибка сервера'));
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Пользователи  не существуют'));
      }
      next(new InternalServerError('Ошибка сервера'));
    });
};

module.exports.getUsersId = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError(`Пользователь с указанным id:${userId} не существует`));
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Неверно указан id пользователя:${userId}  `));
      }
      next(new InternalServerError('Ошибка сервера'));
    });
};

module.exports.patchUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Данные не прошли валидацию на сервере'));
      }
      next(new InternalServerError('Ошибка сервера'));
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Данные не прошли валидацию на сервере'));
      }
      next(new InternalServerError('Ошибка сервера'));
    });
};
