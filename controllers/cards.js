const Card = require('../models/card');

const NotFoundError = require('../utils/errorcodes/not-found-error');
const InternalServerError = require('../utils/errorcodes/internal-server-error');
const BadRequestError = require('../utils/errorcodes/bad-request-error');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/correctcodes');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Данные не прошли валидацию на сервере'));
      }
      next(new InternalServerError(`Ошибка сервера ${error}`));
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Карточка не существует'));
      }
      next(new InternalServerError(`Ошибка сервера ${error}`));
    });
};

module.exports.deleteCardsId = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError(`Карточка с указанным id:${cardId} не существует`));
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError(`Карточка с указанным id:${cardId} не существует`));
      }
      next(new InternalServerError(`Ошибка сервера ${error}`));
    });
};

module.exports.putLikesOnCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        next(new NotFoundError(`Карточка с указанным id:${cardId} не существует`));
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не существует'));
      }
      next(new InternalServerError(`Ошибка сервера ${error}`));
    });
};

module.exports.deleteLikesFromCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        next(new NotFoundError(`Карточка с указанным id:${cardId} не существует`));
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не существует'));
      }
      next(new InternalServerError(`Ошибка сервера ${error}`));
    });
};
