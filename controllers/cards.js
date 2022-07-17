const Card = require('../models/card');

const NotFoundError = require('../utils/errorcodes/not-found-error');
const BadRequest = require('../utils/errorcodes/bad-request-error');
const InternalServerError = require('../utils/errorcodes/internal-server-error');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/correctcodes');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(InternalServerError).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(NotFoundError).send({ message: 'Карточка не существует' });
      }
      res.status(InternalServerError).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteCardsId = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        res.status(NotFoundError).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequest).send({ message: `Карточка с id:${cardId} не существует` });
        return;
      }
      res.status(InternalServerError).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.putLikesOnCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NotFoundError).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Карточка не существует' });
        return;
      }
      res.status(InternalServerError).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteLikesFromCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NotFoundError).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Карточка не существует' });
        return;
      }
      res.status(InternalServerError).send({ message: `Ошибка сервера ${error}` });
    });
};
