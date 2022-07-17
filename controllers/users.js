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
        next(new BadRequestError());
      }
      next(new InternalServerError());
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError());
      }
      next(new InternalServerError());
    });
};

module.exports.getUsersId = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError());
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError());
      }
      next(new InternalServerError());
    });
};

module.exports.patchUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError());
      }
      next(new InternalServerError());
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError());
      }
      next(new InternalServerError());
    });
};
