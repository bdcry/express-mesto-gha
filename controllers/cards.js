const Card = require('../models/card');

const BadRequest = require('../utils/errorcodes/bad-request-error');
const NotFound = require('../utils/errorcodes/not-found-error');

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
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

module.exports.deleteCardsId = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.putLikesOnCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
    })
    .catch(next);
};

module.exports.deleteLikesFromCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
      }
    })
    .catch(next);
};
